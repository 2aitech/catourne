import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-noir-900 border-t border-noir-700/50 mt-24">
      {/* Zellige decorative line */}
      <div className="zellige-border" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 border border-gold-600 flex items-center justify-center">
                <span className="text-gold-400 font-display font-bold text-sm">C</span>
              </div>
              <span className="font-display text-lg tracking-tight">
                <span className="text-cream-100">Casting</span>
                <span className="text-gold-500">Maroc</span>
              </span>
            </div>
            <p className="text-sm text-cream-500 leading-relaxed">
              La plateforme de casting de reference au Maroc. Connectez talents et producteurs.
            </p>
          </div>

          {/* Performeurs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">Performeurs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Creer un profil</Link></li>
              <li><Link to="/offers" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Parcourir les offres</Link></li>
            </ul>
          </div>

          {/* Recruteurs */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">Recruteurs</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Publier une offre</Link></li>
              <li><Link to="/offers" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Decouvrir les talents</Link></li>
            </ul>
          </div>

          {/* Plateforme */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gold-500 mb-4">Plateforme</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Connexion</Link></li>
              <li><Link to="/register" className="text-cream-500 hover:text-gold-400 transition-colors duration-200">Inscription</Link></li>
            </ul>
          </div>
        </div>

        <div className="zellige-border mt-10 mb-8" />

        <div className="text-center text-xs text-cream-500/60 tracking-wide uppercase">
          &copy; {new Date().getFullYear()} CastingMaroc. Tous droits reserves.
        </div>
      </div>
    </footer>
  );
}
