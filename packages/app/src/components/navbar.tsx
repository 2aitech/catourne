import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Button } from "./ui";
import appLogo from "../assets/LOGOS/LOGO-06.png";

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "text-gold-400 font-medium"
    : "text-cream-400 hover:text-gold-400 transition-colors duration-200";
}

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-noir-900/80 backdrop-blur-xl border-b border-noir-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img src={appLogo} alt="Casting Maroc" className="w-9 h-9 rounded-xl object-cover" />
            <span className="font-display text-lg tracking-tight">
              <span className="text-cream-100">Casting</span>
              <span className="text-gold-500">Maroc</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <NavLink to="/offers" className={navClass}>
              Offres
            </NavLink>

            {user?.role === "performer" && (
              <>
                <NavLink to="/performer/profile" className={navClass}>
                  Mon profil
                </NavLink>
                <NavLink to="/performer/applications" className={navClass}>
                  Candidatures
                </NavLink>
              </>
            )}

            {user?.role === "recruiter" && (
              <>
                <NavLink to="/recruiter/dashboard" className={navClass}>
                  Tableau de bord
                </NavLink>
                <NavLink to="/recruiter/offers/new" className={navClass}>
                  Créer une offre
                </NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin/reports" className={navClass}>
                Administration
              </NavLink>
            )}
          </div>

          {/* Auth buttons / user menu */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-cream-500 tracking-wide">
                  {user.email}
                </span>
                <RoleBadge role={user.role} />
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">S'inscrire</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-cream-400 hover:text-gold-400 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-noir-700/50 mt-2">
            <NavLink to="/offers" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
              Offres
            </NavLink>
            {user?.role === "performer" && (
              <>
                <NavLink to="/performer/profile" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
                  Mon profil
                </NavLink>
                <NavLink to="/performer/applications" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
                  Candidatures
                </NavLink>
              </>
            )}
            {user?.role === "recruiter" && (
              <>
                <NavLink to="/recruiter/dashboard" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
                  Tableau de bord
                </NavLink>
                <NavLink to="/recruiter/offers/new" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
                  Créer une offre
                </NavLink>
              </>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin/reports" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>
                Administration
              </NavLink>
            )}
            <div className="pt-3 border-t border-noir-700/50 mt-3">
              {user ? (
                <button className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  Déconnexion ({user.email})
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm">Connexion</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm">S'inscrire</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    performer: "text-gold-400 border-gold-600/30 bg-gold-500/10",
    recruiter: "text-cream-300 border-cream-400/20 bg-cream-200/10",
    admin: "text-wine-400 border-wine-600/30 bg-wine-500/10",
  };
  const labels: Record<string, string> = {
    performer: "Performeur",
    recruiter: "Recruteur",
    admin: "Admin",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 border ${styles[role] ?? "text-cream-400 border-noir-600 bg-noir-700"}`}>
      {labels[role] ?? role}
    </span>
  );
}
