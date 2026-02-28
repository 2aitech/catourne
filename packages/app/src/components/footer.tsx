import { Link } from "react-router-dom";
import { useLang } from "../lib/lang-context";

export function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-noir-900 border-t border-noir-700/40 mt-0">
      {/* Zellige decorative line */}
      <div className="zellige-border" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="inline-block mb-5">
              <span className="font-display text-xl font-bold tracking-tight">
                <span className="text-gold-500">CAT</span>
                <span className="text-cream-100">OURNE</span>
              </span>
            </Link>
            <p className="text-sm text-cream-500 leading-relaxed">
              {lang === "ar"
                ? "\u0645\u0646\u0635\u0629 \u0627\u0644\u0643\u0627\u0633\u062A\u064A\u0646\u063A \u0627\u0644\u0633\u064A\u0646\u0645\u0627\u0626\u064A \u0627\u0644\u0645\u0631\u062C\u0639\u064A\u0629 \u0641\u064A \u0648\u0631\u0632\u0627\u0632\u0627\u062A \u0648\u062C\u0647\u0629 \u062F\u0631\u0639\u0629 \u062A\u0627\u0641\u064A\u0644\u0627\u0644\u062A."
                : lang === "en"
                ? "The leading cinematic casting platform in Ouarzazate and the Draa-Tafilalet region."
                : "La plateforme de casting cinematographique de reference a Ouarzazate et dans la region Draa-Tafilalet."}
            </p>
          </div>

          {/* Talents */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">{t.talents}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register?role=performer" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.register}</Link></li>
              <li><Link to="/offers" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.castings}</Link></li>
            </ul>
          </div>

          {/* Recruteurs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">{t.recruteurs}</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register?role=recruiter" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.register}</Link></li>
              <li><Link to="/talents" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.talents}</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">
              {lang === "ar" ? "\u0627\u0644\u0645\u0646\u0635\u0629" : lang === "en" ? "Platform" : "Plateforme"}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.about}</Link></li>
              <li><Link to="/aide" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.aide}</Link></li>
              <li><Link to="/login" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">{t.login}</Link></li>
            </ul>
          </div>
        </div>

        <div className="zellige-border mt-10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-cream-500/60 tracking-wide">
            &copy; {new Date().getFullYear()} CATOURNE.{" "}
            {lang === "ar" ? "\u062C\u0645\u064A\u0639 \u0627\u0644\u062D\u0642\u0648\u0642 \u0645\u062D\u0641\u0648\u0638\u0629." : lang === "en" ? "All rights reserved." : "Tous droits reserves."}
          </p>
          <p className="text-xs text-cream-500/40 tracking-wide">
            Ouarzazate, Draa-Tafilalet, Maroc
          </p>
        </div>
      </div>
    </footer>
  );
}
