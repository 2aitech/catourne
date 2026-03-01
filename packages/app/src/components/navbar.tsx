import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useLang, type Lang } from "../lib/lang-context";
import { useTheme } from "../lib/theme-context";
import { GlassButton } from "./ui/glass-button";
import appLogo from "../assets/LOGOS/LOGO-06.png";

/* ── Active nav link style ─────────────────────────────────────── */
function navClass({ isActive }: { isActive: boolean }): string {
  return isActive
    ? "relative text-gold-400 font-semibold whitespace-nowrap text-sm tracking-wide after:absolute after:-bottom-0.5 after:left-0 after:right-0 after:h-px after:rounded-full after:bg-gold-500"
    : "relative text-cream-400 hover:text-cream-100 transition-colors duration-200 whitespace-nowrap text-sm tracking-wide";
}

/* ── Language switcher ─────────────────────────────────────────── */
const LANGS: { code: Lang; flag: string; label: string }[] = [
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "en", flag: "🇬🇧", label: "English" },
  { code: "ar", flag: "🇲🇦", label: "العربية" },
];

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const current = LANGS.find((l) => l.code === lang)!;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-cream-400 hover:text-cream-100 hover:bg-white/5 transition-all duration-200 text-xs font-medium uppercase tracking-wider"
        aria-label="Changer de langue"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span>{current.code}</span>
        <svg
          className={`w-3 h-3 opacity-50 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full mt-2 end-0 w-44 bg-noir-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden z-50">
          {LANGS.map(({ code, flag, label }) => (
            <button
              key={code}
              onClick={() => { setLang(code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 ${
                lang === code
                  ? "bg-gold-500/10 text-gold-400"
                  : "text-cream-400 hover:bg-white/5 hover:text-cream-100"
              }`}
            >
              <span className="text-base">{flag}</span>
              <span className="font-medium">{label}</span>
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

/* ── Theme toggle ──────────────────────────────────────────────── */
function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      className="p-2 text-cream-400 hover:text-gold-400 hover:bg-white/5 transition-all duration-200 rounded-lg"
      aria-label="Changer de thème"
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

/* ── Role badge ────────────────────────────────────────────────── */
function RoleBadge({ role }: { role: string }) {
  const { t } = useLang();
  const styles: Record<string, string> = {
    performer: "text-gold-400 border-gold-600/30 bg-gold-500/10",
    recruiter: "text-cream-300 border-cream-400/20 bg-cream-200/10",
    admin: "text-wine-400 border-wine-600/30 bg-wine-500/10",
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 border rounded-full ${styles[role] ?? "text-cream-400 border-noir-600 bg-noir-700"}`}>
      {t.roles[role as keyof typeof t.roles] ?? role}
    </span>
  );
}

/* ── Navbar ────────────────────────────────────────────────────── */
export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); };

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-noir-950/90 backdrop-blur-2xl border-b border-white/8 shadow-lg shadow-black/30"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      {/* Gold top accent line — visible when scrolled */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/60 to-transparent transition-opacity duration-300 ${
          scrolled ? "opacity-100" : "opacity-0"
        }`}
      />

      <div className="max-w-[88rem] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex h-[68px] items-center justify-between gap-8">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-2xl bg-gold-500/20 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={appLogo}
                alt="CATOURNE"
                className="relative w-9 h-9 rounded-xl object-cover"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-gold-500">ÇA</span>
              <span className="text-cream-100">TOURNE</span>
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <div className="hidden xl:flex flex-1 items-center justify-center gap-7">
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

          {/* ── Desktop right controls ── */}
          <div className="hidden xl:flex items-center gap-2 shrink-0">
            <ThemeToggle />
            <LangSwitcher />

            {/* Divider */}
            <div className="w-px h-5 bg-white/10 mx-1" />

            {user ? (
              <div className="flex items-center gap-3">
                <RoleBadge role={user.role} />
                <span className="text-xs text-cream-500 max-w-[140px] truncate">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs text-cream-400 hover:text-gold-400 transition-colors duration-200 font-medium tracking-wide"
                >
                  {t.logout}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm text-cream-400 hover:text-cream-100 transition-colors duration-200 font-medium tracking-wide"
                >
                  {t.login}
                </Link>
                <Link to="/register">
                  <GlassButton size="sm" contentClassName="text-[10px] font-bold uppercase tracking-widest">
                    {t.register}
                  </GlassButton>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile controls ── */}
          <div className="xl:hidden flex items-center gap-1">
            <ThemeToggle />
            <LangSwitcher />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 text-cream-400 hover:text-gold-400 hover:bg-white/5 rounded-lg transition-all duration-200"
              aria-label="Menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile menu panel ── */}
      {mobileOpen && (
        <div className="xl:hidden bg-noir-950/98 backdrop-blur-2xl border-t border-white/8">
          <div className="max-w-[88rem] mx-auto px-5 sm:px-8 py-6 space-y-1">

            {/* Nav links */}
            {[
              { to: "/offers", label: t.castings },
              { to: "/talents", label: t.talents },
              { to: "/recruteurs", label: t.recruteurs },
              { to: "/about", label: t.about },
              ...(user?.role === "performer"
                ? [
                    { to: "/performer/profile", label: t.myProfile },
                    { to: "/performer/applications", label: t.applications },
                  ]
                : []),
              ...(user?.role === "recruiter"
                ? [
                    { to: "/recruiter/dashboard", label: t.dashboard },
                    { to: "/recruiter/offers/new", label: t.createOffer },
                  ]
                : []),
              ...(user?.role === "admin" ? [{ to: "/admin/reports", label: t.admin }] : []),
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                      : "text-cream-400 hover:bg-white/5 hover:text-cream-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="w-1 h-1 rounded-full bg-gold-500 shrink-0" />
                    )}
                    {label}
                  </>
                )}
              </NavLink>
            ))}

            {/* Auth section */}
            <div className="pt-4 mt-4 border-t border-white/8">
              {user ? (
                <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/3 border border-white/8">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-cream-500 truncate max-w-[200px]">{user.email}</span>
                    <RoleBadge role={user.role} />
                  </div>
                  <button
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="text-xs text-cream-400 hover:text-gold-400 transition-colors font-medium"
                  >
                    {t.logout}
                  </button>
                </div>
              ) : (
                <div className="flex gap-3 px-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 text-center py-3 text-sm text-cream-400 hover:text-cream-100 transition-colors font-medium rounded-xl hover:bg-white/5"
                  >
                    {t.login}
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1"
                  >
                    <GlassButton
                      size="sm"
                      className="w-full"
                      contentClassName="w-full justify-center flex text-[10px] font-bold uppercase tracking-widest"
                    >
                      {t.register}
                    </GlassButton>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
