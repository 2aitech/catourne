import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Card, Badge, Select, PageContainer, LoadingSpinner } from "../components/ui";

export function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  useEffect(() => {
    request<{ offers: Offer[] }>("/offers")
      .then((data) => setOffers(data.offers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(offers.map((o) => o.city).filter(Boolean))].sort();
  const types = [...new Set(offers.map((o) => o.project_type).filter(Boolean))].sort();

  const filtered = offers.filter((o) => {
    if (cityFilter && o.city !== cityFilter) return false;
    if (typeFilter && o.project_type !== typeFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Explorer</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">Offres de casting</h1>
        <p className="text-cream-500 mt-3 text-sm">
          Decouvrez les opportunites disponibles et postulez en un clic
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="w-52">
          <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="w-52">
          <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="">Tous les types</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        {(cityFilter || typeFilter) && (
          <Button variant="ghost" size="sm" onClick={() => { setCityFilter(""); setTypeFilter(""); }}>
            Effacer les filtres
          </Button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-cream-500 text-lg font-display">Aucune offre trouvee</p>
          {(cityFilter || typeFilter) && (
            <Button variant="ghost" className="mt-4" onClick={() => { setCityFilter(""); setTypeFilter(""); }}>
              Effacer les filtres
            </Button>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
          {filtered.map((offer) => (
            <Link key={offer.id} to={`/offers/${offer.id}`}>
              <Card className="p-5 hover:border-gold-700/50 transition-all duration-300 h-full flex flex-col group">
                <div className="flex items-start justify-between mb-4">
                  <Badge color="primary">{offer.project_type}</Badge>
                  <Badge color="gray">{offer.applications_count ?? 0} candidat{(offer.applications_count ?? 0) !== 1 ? "s" : ""}</Badge>
                </div>
                <h3 className="font-display font-semibold text-cream-100 mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors duration-200">{offer.title}</h3>
                <p className="text-sm text-cream-500 line-clamp-3 mb-5 flex-grow leading-relaxed">
                  {offer.description}
                </p>
                <div className="flex items-center justify-between text-xs text-cream-500/60 pt-4 border-t border-noir-700">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {offer.city}
                  </span>
                  <span>Limite: {formatDate(offer.deadline_at)}</span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
