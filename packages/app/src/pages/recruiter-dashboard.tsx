import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Card, Badge, PageContainer, LoadingSpinner } from "../components/ui";

export function RecruiterDashboardPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ offers: Offer[] }>("/offers?mine=1")
      .then((data) => setOffers(data.offers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalApplications = offers.reduce((sum, o) => sum + (o.applications_count ?? 0), 0);
  const publishedCount = offers.filter((o) => o.status === "published").length;
  const draftCount = offers.filter((o) => o.status === "draft").length;

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Espace recruteur</p>
          <h1 className="font-display text-3xl font-bold text-cream-100">Tableau de bord</h1>
          <p className="text-cream-500 mt-3 text-sm">Gerez vos offres et candidatures</p>
        </div>
        <Link to="/recruiter/offers/new">
          <Button>
            <svg className="w-3.5 h-3.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle offre
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-5 mb-12">
        <Card className="p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-2">Offres publiees</p>
          <p className="text-3xl font-display font-bold text-gold-400">{publishedCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-2">Brouillons</p>
          <p className="text-3xl font-display font-bold text-cream-200">{draftCount}</p>
        </Card>
        <Card className="p-6">
          <p className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-2">Candidatures recues</p>
          <p className="text-3xl font-display font-bold text-cream-200">{totalApplications}</p>
        </Card>
      </div>

      {/* Offers list */}
      <div className="flex items-center gap-3 mb-6">
        <span className="w-6 h-px bg-gold-600" />
        <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">Mes offres</h2>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : offers.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-cream-500 text-lg font-display mb-5">Aucune offre creee</p>
          <Link to="/recruiter/offers/new">
            <Button>Creer ma premiere offre</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {offers.map((offer) => (
            <Card key={offer.id} className="p-5 hover:border-noir-600 transition-colors duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-display font-semibold text-cream-100 truncate">{offer.title}</h3>
                    <Badge color={offer.status === "published" ? "green" : "gray"}>
                      {offer.status === "published" ? "Publiee" : "Brouillon"}
                    </Badge>
                  </div>
                  <p className="text-xs text-cream-500">
                    {offer.city} &middot; {offer.project_type} &middot;{" "}
                    {offer.applications_count ?? 0} candidature{(offer.applications_count ?? 0) !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {offer.status === "draft" && (
                    <PublishButton offerId={offer.id} onPublished={() => {
                      request<{ offers: Offer[] }>("/offers?mine=1")
                        .then((data) => setOffers(data.offers ?? []))
                        .catch(() => {});
                    }} />
                  )}
                  <Link to={`/recruiter/offers/${offer.id}/applications`}>
                    <Button variant="outline" size="sm">Candidatures</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </PageContainer>
  );
}

function PublishButton({ offerId, onPublished }: { offerId: string; onPublished: () => void }) {
  const [loading, setLoading] = useState(false);
  const handlePublish = async () => {
    setLoading(true);
    try {
      await request(`/offers/${offerId}/publish`, { method: "POST" });
      onPublished();
    } catch {
    } finally {
      setLoading(false);
    }
  };
  return (
    <Button size="sm" onClick={handlePublish} disabled={loading}>
      {loading ? "..." : "Publier"}
    </Button>
  );
}
