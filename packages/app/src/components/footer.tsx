import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin } from "lucide-react";
import { useLang } from "../lib/lang-context";
import logo from "../assets/LOGOS/LOGO-06.png";

const SOCIAL_LINKS = [
  {
    icon: <Facebook className="w-5 h-5" />,
    href: "https://facebook.com",
    label: "Facebook",
  },
  {
    icon: <Instagram className="w-5 h-5" />,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: <Linkedin className="w-5 h-5" />,
    href: "https://linkedin.com",
    label: "LinkedIn",
  },
];

export function Footer() {
  const { t, lang } = useLang();

  const description =
    lang === "ar"
      ? "منصة الكاستينغ السينمائي المرجعية في ورزازات وجهة درعة تافيلالت."
      : lang === "en"
      ? "The leading cinematic casting platform in Ouarzazate and the Draa-Tafilalet region."
      : "La plateforme de casting cinématographique de référence à Ouarzazate et dans la région Draa-Tafilalet.";

  const copyright =
    lang === "ar"
      ? "جميع الحقوق محفوظة."
      : lang === "en"
      ? "All rights reserved."
      : "Tous droits réservés.";

  const navLinks = [
    { label: t.castings, to: "/offers" },
    { label: t.talents, to: "/talents" },
    { label: t.about, to: "/about" },
    { label: t.aide, to: "/aide" },
    { label: t.register, to: "/register" },
    { label: t.login, to: "/login" },
  ];

  return (
    <section className="relative w-full mt-0 px-3 sm:px-4">
      <footer className="rounded-t-[2rem] border border-noir-700/30 border-b-0 bg-noir-950 mt-0 relative overflow-hidden">
        {/* Center glow at top edge */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-noir-600/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(255,255,255,0.04),transparent)] pointer-events-none" />

        <div className="max-w-7xl flex flex-col justify-between mx-auto min-h-[30rem] sm:min-h-[35rem] md:min-h-[40rem] relative p-4 py-10">

          {/* Top content */}
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full">
            <div className="w-full flex flex-col items-center">

              {/* Brand name */}
              <div className="space-y-2 flex flex-col items-center flex-1">
                <Link to="/" className="flex items-center gap-1">
                  <span className="font-display text-3xl font-bold tracking-tight">
                    <span className="text-gold-500">CAT</span>
                    <span className="text-cream-100">OURNE</span>
                  </span>
                </Link>
                <p className="text-cream-500 font-semibold text-center w-full max-w-sm sm:w-96 px-4 sm:px-0 text-sm leading-relaxed">
                  {description}
                </p>
              </div>

              {/* Social links */}
              <div className="flex mb-8 mt-5 gap-5">
                {SOCIAL_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-cream-500 hover:text-gold-400 transition-colors duration-200"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.label}
                  >
                    <div className="w-6 h-6 hover:scale-110 duration-300">
                      {link.icon}
                    </div>
                  </a>
                ))}
              </div>

              {/* Nav links */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm font-medium text-cream-500 max-w-full px-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="hover:text-gold-400 hover:font-semibold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-20 md:mt-24 flex flex-col gap-2 md:gap-1 items-center justify-center md:flex-row md:items-center md:justify-between px-4 md:px-0">
            <p className="text-sm text-cream-500/60 text-center md:text-left tracking-wide">
              &copy; {new Date().getFullYear()} CATOURNE. {copyright}
            </p>
            <p className="text-xs text-cream-500/40 tracking-wide">
              Ouarzazate, Draa-Tafilalet, Maroc
            </p>
          </div>
        </div>

        {/* Large scrolling background brand text */}
        <div className="absolute inset-x-0 bottom-36 md:bottom-28 overflow-hidden pointer-events-none select-none">
          <div
            className="animate-marquee flex whitespace-nowrap"
            style={{ fontSize: "clamp(3rem, 15vw, 16rem)", lineHeight: 1 }}
          >
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="bg-gradient-to-b from-cream-100/15 via-cream-100/6 to-transparent bg-clip-text text-transparent font-extrabold tracking-tighter pr-16"
              >
                CATOURNE
              </span>
            ))}
          </div>
        </div>

        {/* Bottom logo icon */}
        <div className="absolute hover:border-gold-500/60 duration-300 drop-shadow-[0_0px_20px_rgba(194,142,76,0.3)] bottom-24 md:bottom-20 backdrop-blur-sm rounded-3xl bg-noir-950/60 left-1/2 border-2 border-noir-700/60 flex items-center justify-center p-3 -translate-x-1/2 z-10 transition-colors">
          <img
            src={logo}
            alt="CATOURNE"
            className="w-12 sm:w-16 md:w-24 h-12 sm:h-16 md:h-24 rounded-2xl object-cover shadow-lg shadow-gold-500/20"
          />
        </div>

        {/* Divider line above logo */}
        <div className="absolute bottom-32 sm:bottom-34 backdrop-blur-sm h-px bg-gradient-to-r from-transparent via-noir-700/60 to-transparent w-full left-1/2 -translate-x-1/2" />

        {/* Bottom fade shadow */}
        <div className="bg-gradient-to-t from-noir-950 via-noir-950/80 blur-[1em] to-noir-950/40 absolute bottom-28 w-full h-24 pointer-events-none" />
      </footer>
    </section>
  );
}
