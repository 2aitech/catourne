import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button, Input, Card } from "../components/ui";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    const dest =
      user.role === "recruiter"
        ? "/recruiter/dashboard"
        : user.role === "admin"
          ? "/admin/reports"
          : "/offers";
    return <Navigate to={dest} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 animate-page-enter">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-gold-600 flex items-center justify-center">
              <span className="text-gold-400 font-display font-bold">C</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream-100">Bon retour</h1>
          <p className="text-cream-500 mt-3 text-sm">Connectez-vous a votre compte CastingMaroc</p>
        </div>

        <Card className="p-7 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-wine-700/20 border border-wine-700/30 text-wine-400 text-sm">
                {error}
              </div>
            )}
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
            <Input
              label="Mot de passe"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Votre mot de passe"
              minLength={8}
              required
            />
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Connexion..." : "Se connecter"}
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-sm text-cream-500">
          Pas encore de compte ?{" "}
          <Link to="/register" className="text-gold-500 font-medium hover:text-gold-400 transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
}
