import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Card, Badge, PageContainer } from "../components/ui";

export function HomePage() {
  const { user } = useAuth();
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);

  useEffect(() => {
    request<{ offers: Offer[] }>("/offers")
      .then((data) => setRecentOffers((data.offers ?? []).slice(0, 4)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Dramatic ambient lighting */}
        <div className="absolute inset-0 bg-noir-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_20%_40%,rgba(212,168,83,0.08),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_80%,rgba(178,37,72,0.06),transparent)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent" />

        {/* Geometric Moroccan-inspired decorative element */}
        <div className="absolute top-20 right-10 lg:right-20 w-64 h-64 opacity-[0.04] pointer-events-none">
          <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 0L200 100L100 200L0 100Z" stroke="currentColor" strokeWidth="0.5" className="text-gold-400" />
            <path d="M100 20L180 100L100 180L20 100Z" stroke="currentColor" strokeWidth="0.5" className="text-gold-400" />
            <path d="M100 40L160 100L100 160L40 100Z" stroke="currentColor" strokeWidth="0.5" className="text-gold-400" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" className="text-gold-400" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="0.5" className="text-gold-400" />
          </svg>
        </div>

        <PageContainer className="relative animate-page-enter py-20">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500 mb-6">
              Plateforme de casting
            </p>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-100 leading-[1.05] tracking-tight">
              Le talent rencontre
              <br />
              <span className="text-gold-500 italic">l'opportunite</span>
            </h1>
            <p className="mt-8 text-lg text-cream-400 max-w-xl leading-relaxed">
              Connectez performeurs talentueux et producteurs ambitieux. La reference du casting au Maroc.
            </p>
            <div className="mt-12 flex flex-wrap gap-4">
              {user ? (
                <Link to={user.role === "recruiter" ? "/recruiter/dashboard" : "/offers"}>
                  <Button size="lg">
                    {user.role === "recruiter" ? "Mon tableau de bord" : "Parcourir les offres"}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register?role=performer">
                    <Button size="lg">
                      Je suis performeur
                    </Button>
                  </Link>
                  <Link to="/register?role=recruiter">
                    <Button size="lg" variant="outline">
                      Je suis recruteur
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </PageContainer>
      </section>

      {/* How it works */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-noir-900/50" />
        <PageContainer className="relative">
          <div className="text-center mb-16 animate-page-enter">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-4">Comment ca fonctionne</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
              Simple. Efficace. <span className="italic text-gold-400">Elegant.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-16 max-w-5xl mx-auto stagger-children">
            {/* Performer steps */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500 mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-gold-600" />
                Pour les performeurs
              </h3>
              <div className="space-y-8">
                <Step number={1} title="Creez votre profil" desc="Renseignez votre specialite, ville, langues et ajoutez une bio percutante." />
                <Step number={2} title="Decouvrez les offres" desc="Parcourez les castings publies par les recruteurs et filtrez par ville ou type de projet." />
                <Step number={3} title="Postulez en un clic" desc="Envoyez votre candidature avec un message de motivation et suivez son avancement." />
              </div>
            </div>

            {/* Recruiter steps */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-cream-400 mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-cream-500" />
                Pour les recruteurs
              </h3>
              <div className="space-y-8">
                <Step number={1} title="Publiez votre offre" desc="Decrivez le role, le type de projet, la ville et la date limite de candidature." />
                <Step number={2} title="Recevez des candidatures" desc="Les performeurs interessés postulent directement. Gerez tout depuis votre tableau de bord." />
                <Step number={3} title="Selectionnez vos talents" desc="Passez en revue les profils, shortlistez et selectionnez les meilleurs candidats." />
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* Recent Offers */}
      {recentOffers.length > 0 && (
        <section className="py-24">
          <PageContainer>
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-4">Dernieres opportunites</p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
                  Offres recentes
                </h2>
              </div>
              <Link to="/offers">
                <Button variant="outline" size="sm">Voir tout</Button>
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
              {recentOffers.map((offer) => (
                <Link key={offer.id} to={`/offers/${offer.id}`}>
                  <Card className="p-5 hover:border-gold-700/50 transition-all duration-300 h-full group">
                    <Badge color="primary" className="mb-4">{offer.project_type}</Badge>
                    <h3 className="font-display font-semibold text-cream-100 mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors duration-200">{offer.title}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-cream-500 mb-2">
                      <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {offer.city}
                    </div>
                    <p className="text-xs text-cream-500/60">
                      Limite: {formatDate(offer.deadline_at)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </PageContainer>
        </section>
      )}

      {/* Value props */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-noir-900/50" />
        <PageContainer className="relative">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
              Pourquoi <span className="text-gold-500 italic">CastingMaroc</span> ?
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto stagger-children">
            <ValueProp
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              }
              title="Confiance"
              desc="Profils verifies et systeme de moderation pour un environnement professionnel securise."
            />
            <ValueProp
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              }
              title="Visibilite"
              desc="Maximisez vos chances d'etre vu par les bons recruteurs ou de trouver le talent ideal."
            />
            <ValueProp
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              }
              title="Efficacite"
              desc="Processus simplifie de la candidature a la selection. Gagnez du temps sur chaque projet."
            />
          </div>
        </PageContainer>
      </section>

      {/* CTA */}
      {!user && (
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(212,168,83,0.06),transparent)]" />
          <PageContainer className="relative text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100 mb-5">
              Pret a commencer ?
            </h2>
            <p className="text-cream-400 mb-10 max-w-xl mx-auto leading-relaxed">
              Rejoignez la communaute CastingMaroc et decouvrez de nouvelles opportunites des aujourd'hui.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/register">
                <Button size="lg">Creer un compte</Button>
              </Link>
              <Link to="/offers">
                <Button size="lg" variant="outline">
                  Voir les offres
                </Button>
              </Link>
            </div>
          </PageContainer>
        </section>
      )}
    </div>
  );
}

function Step({ number, title, desc }: { number: number; title: string; desc: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 w-8 h-8 border border-noir-600 text-cream-500 font-display font-semibold flex items-center justify-center text-sm">
        {number}
      </div>
      <div>
        <h4 className="font-medium text-cream-200 mb-1">{title}</h4>
        <p className="text-sm text-cream-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function ValueProp({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="text-center group">
      <div className="w-12 h-12 border border-gold-700/50 text-gold-500 flex items-center justify-center mx-auto mb-5 group-hover:border-gold-500/60 group-hover:bg-gold-500/5 transition-all duration-300">
        {icon}
      </div>
      <h3 className="font-display font-semibold text-cream-100 mb-2">{title}</h3>
      <p className="text-sm text-cream-500 leading-relaxed">{desc}</p>
    </div>
  );
}
