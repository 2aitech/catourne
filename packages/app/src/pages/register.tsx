import { useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import type { Role } from "../lib/types";
import { Button, Input, Card } from "../components/ui";

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get("role") as Role | null;

  const [step, setStep] = useState<1 | 2>(preselectedRole ? 2 : 1);
  const [role, setRole] = useState<Role>(preselectedRole ?? "performer");
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
          : "/performer/profile";
    return <Navigate to={dest} replace />;
  }

  const selectRole = (r: Role) => {
    setRole(r);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email.trim(), password, role);
      navigate(role === "recruiter" ? "/recruiter/dashboard" : "/performer/profile");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16 animate-page-enter">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-gold-600 flex items-center justify-center">
              <span className="text-gold-400 font-display font-bold">C</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream-100">Creer votre compte</h1>
          <p className="text-cream-500 mt-3 text-sm">
            {step === 1
              ? "Choisissez votre profil pour commencer"
              : `Inscription en tant que ${role === "performer" ? "performeur" : "recruteur"}`}
          </p>
        </div>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-5 stagger-children">
            <RoleCard
              title="Performeur"
              description="Je suis artiste, acteur, figurant ou technicien et je cherche des opportunites de casting."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              color="gold"
              onClick={() => selectRole("performer")}
            />
            <RoleCard
              title="Recruteur"
              description="Je suis producteur, realisateur ou directeur de casting et je cherche des talents."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              color="cream"
              onClick={() => selectRole("recruiter")}
            />
          </div>
        )}

        {/* Step 2: Registration form */}
        {step === 2 && (
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
                placeholder="Minimum 8 caracteres"
                minLength={8}
                required
              />

              <div className="pt-2">
                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                  {loading ? "Creation..." : "Creer mon compte"}
                </Button>
              </div>

              {!preselectedRole && (
                <button
                  type="button"
                  className="w-full text-center text-sm text-cream-500 hover:text-gold-400 transition-colors"
                  onClick={() => setStep(1)}
                >
                  &larr; Changer de profil
                </button>
              )}
            </form>
          </Card>
        )}

        <p className="text-center mt-8 text-sm text-cream-500">
          Deja inscrit ?{" "}
          <Link to="/login" className="text-gold-500 font-medium hover:text-gold-400 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

function RoleCard({
  title,
  description,
  icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "gold" | "cream";
  onClick: () => void;
}) {
  const borderHover = color === "gold" ? "hover:border-gold-600/60" : "hover:border-cream-400/30";
  const iconColor = color === "gold" ? "text-gold-500 border-gold-700/40" : "text-cream-300 border-cream-400/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-6 bg-noir-800/60 border border-noir-700 ${borderHover} hover:bg-noir-800 transition-all duration-300 cursor-pointer group`}
    >
      <div className={`w-14 h-14 border ${iconColor} flex items-center justify-center mb-5 group-hover:bg-noir-700/50 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-cream-100 mb-2">{title}</h3>
      <p className="text-sm text-cream-500 leading-relaxed">{description}</p>
    </button>
  );
}
