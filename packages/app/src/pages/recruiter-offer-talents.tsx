import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getApiBase, request } from "../lib/api";
import type { Offer, RecruiterTalentMatch } from "../lib/types";
import { Badge, Button, Card, LoadingSpinner, PageContainer } from "../components/ui";

const statusColors: Record<string, "gray" | "blue" | "accent" | "green" | "red"> = {
  submitted: "gray",
  in_review: "blue",
  shortlisted: "accent",
  selected: "green",
  rejected: "red",
};

const statusLabels: Record<string, string> = {
  submitted: "Soumise",
  in_review: "En revue",
  shortlisted: "Preselectionnee",
  selected: "Selectionnee",
  rejected: "Refusee",
};

function normalizePhone(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

export function RecruiterOfferTalentsPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [talents, setTalents] = useState<RecruiterTalentMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!offerId) return;
    setLoading(true);
    setError("");

    Promise.all([
      request<{ offer: Offer }>(`/offers/${offerId}`),
      request<{ talents: RecruiterTalentMatch[] }>(`/offers/${offerId}/talents?limit=50`),
    ])
      .then(([offerData, talentsData]) => {
        setOffer(offerData.offer ?? null);
        setTalents(talentsData.talents ?? []);
      })
      .catch((err) => setError((err as Error).message))
      .finally(() => setLoading(false));
  }, [offerId]);

  if (loading) {
    return (
      <PageContainer className="py-20">
        <LoadingSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-12 animate-page-enter">
      <Link
        to="/recruiter/dashboard"
        className="text-xs uppercase tracking-widest text-cream-500 hover:text-gold-400 mb-8 inline-flex items-center gap-2 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Retour au tableau de bord
      </Link>

      <div className="mb-10 mt-6">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">
          Talents recommandes
        </p>
        <h1 className="font-display text-3xl font-bold text-cream-100">
          {offer?.title || "Offre"}
        </h1>
        <p className="text-cream-500 mt-3 text-sm">
          Classement automatique des talents par score de matching.
        </p>
      </div>

      <div className="mb-7">
        <Link to={`/recruiter/offers/${offerId}/applications`}>
          <Button variant="outline" size="sm">Voir les candidatures</Button>
        </Link>
      </div>

      {error ? (
        <Card className="p-6">
          <p className="text-wine-400 text-sm">{error}</p>
        </Card>
      ) : talents.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-cream-500 text-lg font-display">Aucun talent disponible pour le moment</p>
        </Card>
      ) : (
        <div className="space-y-4 stagger-children">
          {talents.map((talent, index) => {
            const phone = normalizePhone(talent.phone);
            const photoSrc = talent.photo_url
              ? talent.photo_url.startsWith("http")
                ? talent.photo_url
                : `${getApiBase()}${talent.photo_url}`
              : "";

            return (
              <Card key={talent.performer_user_id} className="p-5 hover:border-noir-600 transition-colors duration-200">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 shrink-0 border border-gold-700/40 text-gold-400 flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </div>

                  <div className="w-12 h-12 shrink-0 overflow-hidden border border-noir-600 bg-noir-900">
                    {photoSrc ? (
                      <img src={photoSrc} alt={talent.stage_name || "Talent"} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-noir-500 text-xs">N/A</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <h3 className="font-display font-semibold text-cream-100 truncate">
                        {talent.stage_name || talent.performer_user_id}
                      </h3>
                      {talent.application_status && (
                        <Badge color={statusColors[talent.application_status] ?? "gray"}>
                          {statusLabels[talent.application_status] ?? talent.application_status}
                        </Badge>
                      )}
                    </div>

                    <p className="text-xs text-cream-500">
                      {talent.city || "Ville non renseignee"} &middot;{" "}
                      {talent.specialty || "Specialite non renseignee"} &middot;{" "}
                      Profil {talent.completion_score ?? 0}%
                    </p>

                    {talent.match_reasons?.length > 0 && (
                      <p className="text-xs text-cream-400 mt-2">
                        {talent.match_reasons.join(" | ")}
                      </p>
                    )}
                  </div>

                  <div className="text-right shrink-0">
                    <div className="mb-3">
                      <p className="text-[10px] uppercase tracking-widest text-cream-500">Score</p>
                      <p className="font-display text-2xl text-gold-400 leading-none">{talent.match_score}</p>
                    </div>
                    {phone ? (
                      <a href={`tel:${phone}`}>
                        <Button size="sm">Contact</Button>
                      </a>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Contact
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </PageContainer>
  );
}
