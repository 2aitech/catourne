import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Eye, EyeOff, ChevronRight } from "lucide-react";
import logo from "../assets/LOGOS/LOGO-06.png";

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    const dest = user.role === "recruiter" ? "/recruiter/dashboard" : user.role === "admin" ? "/admin/reports" : "/offers";
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
    <div className="min-h-[calc(100dvh-68px)] flex bg-noir-950 overflow-x-hidden">

      {/* ── Left panel: cinematic ──────────────────────────── */}
      <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col overflow-hidden shrink-0">
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=1200')" }}
        />
        <div className="absolute inset-0 bg-noir-950/65" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/25 to-noir-950/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950/30 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_60%,rgba(194,142,76,0.11),transparent)] pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-12">

          {/* Top spacer */}
          <div />

          {/* Center: brand + headline */}
          <div>
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="CATOURNE" className="w-14 h-14 rounded-2xl object-cover shadow-xl shadow-gold-500/25" />
            </Link>
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-8 bg-gold-500" />
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-400">Plateforme de casting</span>
            </div>
            <h2 className="font-serif font-bold text-cream-50 leading-tight mb-4" style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
              Bon retour<br />
              parmi nous.
            </h2>
            <p className="text-cream-400 text-sm leading-relaxed max-w-xs">
              Connectez-vous pour accéder à vos castings, votre profil et vos opportunités.
            </p>
          </div>

          {/* Bottom: stats row */}
          <div className="rounded-2xl border border-white/10 bg-noir-900/60 backdrop-blur-md p-5">
            <div className="flex items-center justify-between">
              {[
                { value: "+500", label: "Talents actifs" },
                { value: "+200", label: "Castings lancés" },
                { value: "+50",  label: "Agences" },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-8 bg-white/10" />}
                  <div>
                    <p className="font-serif text-xl font-bold text-gold-400 leading-none">{s.value}</p>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cream-500 mt-1">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right edge fade */}
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-noir-950 to-transparent pointer-events-none" />
      </div>

      {/* ── Right panel: form ──────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <Link to="/">
              <img src={logo} alt="CATOURNE" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-gold-500/20" />
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <Link to="/" className="hidden lg:inline-block mb-6">
              <img src={logo} alt="CATOURNE" className="w-8 h-8 rounded-lg object-cover shadow-md shadow-gold-500/20" />
            </Link>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mb-1.5">
              Se connecter
            </h1>
            <p className="text-neutral-500 text-sm">
              Pas encore de compte ?{" "}
              <Link to="/register" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                S'inscrire
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                <span className="shrink-0 mt-0.5">⚠</span>
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">
                Adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                required
                autoComplete="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-[11px] text-gold-400/70 hover:text-gold-400 transition-colors font-medium"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Votre mot de passe"
                  minLength={8}
                  required
                  autoComplete="current-password"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 pr-12 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-cream-300 transition-colors"
                  aria-label={showPassword ? "Masquer" : "Afficher"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 mt-2 rounded-2xl bg-gold-500 text-noir-950 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />
                  Connexion...
                </>
              ) : (
                <>
                  Se connecter
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[11px] text-neutral-600 font-medium">ou continuer avec</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>

            {/* Social buttons */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 h-11 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-cream-300 hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2.5 h-11 rounded-2xl bg-white/5 border border-white/10 text-xs font-semibold text-cream-300 hover:bg-white/8 hover:border-white/20 transition-all"
              >
                <svg className="w-4 h-4 fill-cream-300" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>

          </form>

          <p className="text-center mt-8 text-xs text-neutral-600">
            En vous connectant, vous acceptez nos{" "}
            <span className="text-neutral-500 hover:text-gold-400 cursor-pointer transition-colors">Conditions d'utilisation</span>
            {" "}et notre{" "}
            <span className="text-neutral-500 hover:text-gold-400 cursor-pointer transition-colors">Politique de confidentialité</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
