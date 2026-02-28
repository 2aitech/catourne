import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useLang, type Lang } from "../lib/lang-context";
import { useTheme } from "../lib/theme-context";
import { Button } from "./ui";

function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "text-gold-400 font-medium"
    : "text-cream-400 hover:text-gold-400 transition-colors duration-200";
}

const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "fr", flag: "\u{1F1EB}\u{1F1F7}", label: "Fran\u00E7ais" },
  { code: "en", flag: "\u{1F1EC}\u{1F1E7}", label: "English" },
  { code: "ar", flag: "\u{1F1F2}\u{1F1E6}", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
];

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-cream-400 hover:text-gold-400 transition-colors duration-200 p-1.5 rounded-lg hover:bg-noir-700/50"
        aria-label="Changer de langue"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253M3.284 14.253A8.959 8.959 0 0 1 3 12c0-1.016.135-2 .386-2.936" />
        </svg>
        <span className="text-xs font-medium uppercase tracking-wide">{current.code}</span>
        <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 end-0 w-40 bg-noir-800 border border-noir-700/60 rounded-xl shadow-2xl overflow-hidden z-50">
          {LANGS.map(({ code, flag, label }) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-sm transition-colors duration-150 ${
                lang === code
                  ? "bg-gold-500/10 text-gold-400"
                  : "text-cream-400 hover:bg-noir-700/60 hover:text-cream-100"
              }`}
            >
              <span className="text-base">{flag}</span>
              <span>{label}</span>
              {lang === code && (
                <svg className="w-3 h-3 ms-auto text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-1.5 text-cream-400 hover:text-gold-400 transition-colors duration-200 rounded-lg hover:bg-noir-700/50"
      aria-label="Changer de theme"
    >
      {theme === "dark" ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
        </svg>
      )}
    </button>
  );
}

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-noir-950/80 backdrop-blur-xl border-b border-noir-700/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-gold-500">CAT</span>
              <span className="text-cream-100">OURNE</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            <NavLink to="/offers" className={navClass}>{t.castings}</NavLink>
            <NavLink to="/talents" className={navClass}>{t.talents}</NavLink>
            <NavLink to="/recruteurs" className={navClass}>{t.recruteurs}</NavLink>
            <NavLink to="/about" className={navClass}>{t.about}</NavLink>

            {user?.role === "performer" && (
              <>
                <NavLink to="/performer/profile" className={navClass}>{t.myProfile}</NavLink>
                <NavLink to="/performer/applications" className={navClass}>{t.applications}</NavLink>
              </>
            )}

            {user?.role === "recruiter" && (
              <>
                <NavLink to="/recruiter/dashboard" className={navClass}>{t.dashboard}</NavLink>
                <NavLink to="/recruiter/offers/new" className={navClass}>{t.createOffer}</NavLink>
              </>
            )}

            {user?.role === "admin" && (
              <NavLink to="/admin/reports" className={navClass}>{t.admin}</NavLink>
            )}
          </div>

          {/* Auth buttons + lang + theme */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <LangSwitcher />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-cream-500 tracking-wide">{user.email}</span>
                <RoleBadge role={user.role} />
                <Button variant="ghost" size="sm" onClick={handleLogout}>{t.logout}</Button>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">{t.login}</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">{t.register}</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile controls */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <LangSwitcher />
            <button
              className="p-2 text-cream-400 hover:text-gold-400 transition-colors"
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
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1 border-t border-noir-700/50 mt-2">
            <NavLink to="/offers" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.castings}</NavLink>
            <NavLink to="/talents" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.talents}</NavLink>
            <NavLink to="/recruteurs" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.recruteurs}</NavLink>
            <NavLink to="/about" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.about}</NavLink>
            {user?.role === "performer" && (
              <>
                <NavLink to="/performer/profile" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.myProfile}</NavLink>
                <NavLink to="/performer/applications" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.applications}</NavLink>
              </>
            )}
            {user?.role === "recruiter" && (
              <>
                <NavLink to="/recruiter/dashboard" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.dashboard}</NavLink>
                <NavLink to="/recruiter/offers/new" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.createOffer}</NavLink>
              </>
            )}
            {user?.role === "admin" && (
              <NavLink to="/admin/reports" className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => setMobileOpen(false)}>{t.admin}</NavLink>
            )}
            <div className="pt-3 border-t border-noir-700/50 mt-3">
              {user ? (
                <button className="block py-2.5 text-sm text-cream-400 hover:text-gold-400 transition-colors" onClick={() => { handleLogout(); setMobileOpen(false); }}>
                  {t.logout} ({user.email})
                </button>
              ) : (
                <div className="flex gap-3">
                  <Link to="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="ghost" size="sm">{t.login}</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)}>
                    <Button size="sm">{t.register}</Button>
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
  const { t } = useLang();
  const styles: Record<string, string> = {
    performer: "text-gold-400 border-gold-600/30 bg-gold-500/10",
    recruiter: "text-cream-300 border-cream-400/20 bg-cream-200/10",
    admin: "text-wine-400 border-wine-600/30 bg-wine-500/10",
  };
  return (
    <span className={`text-[10px] font-semibold uppercase tracking-widest px-2.5 py-0.5 border rounded ${styles[role] ?? "text-cream-400 border-noir-600 bg-noir-700"}`}>
      {t.roles[role as keyof typeof t.roles] ?? role}
    </span>
  );
}
