import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Card, Badge, Textarea, PageContainer, LoadingSpinner } from "../components/ui";

export function OfferDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(true);
  const [motivation, setMotivation] = useState("");
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    request<{ offers: Offer[] }>("/offers")
      .then((data) => {
        const found = (data.offers ?? []).find((o) => o.id === id);
        setOffer(found ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setApplying(true);
    setError("");
    try {
      await request(`/offers/${id}/apply`, {
        method: "POST",
        body: { motivation_text: motivation },
      });
      setApplied(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <PageContainer className="py-20">
        <LoadingSpinner />
      </PageContainer>
    );
  }

  if (!offer) {
    return (
      <PageContainer className="py-20 text-center">
        <p className="text-cream-500 text-lg font-display">Offre introuvable</p>
        <Link to="/offers" className="mt-6 inline-block">
          <Button variant="outline">Retour aux offres</Button>
        </Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-12 animate-page-enter">
      <Link to="/offers" className="text-xs uppercase tracking-widest text-cream-500 hover:text-gold-400 mb-8 inline-flex items-center gap-2 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
        Retour aux offres
      </Link>

      <div className="grid lg:grid-cols-3 gap-8 mt-6">
        {/* Main content */}
        <div className="lg:col-span-2">
          <Card className="p-7 sm:p-9">
            <div className="flex flex-wrap gap-2 mb-5">
              <Badge color="primary">{offer.project_type}</Badge>
              <Badge color="gray">{offer.status}</Badge>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-cream-100 mb-5">{offer.title}</h1>
            <div className="flex flex-wrap gap-5 text-xs text-cream-500 mb-8">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {offer.city}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Limite: {formatDate(offer.deadline_at)}
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {offer.applications_count ?? 0} candidature{(offer.applications_count ?? 0) !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="zellige-border mb-8" />
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500 mb-4">Description</h3>
              <p className="text-cream-300 whitespace-pre-wrap leading-relaxed">{offer.description}</p>
            </div>
          </Card>
        </div>

        {/* Sidebar: Apply */}
        <div>
          <Card className="p-6 sticky top-24">
            {!user ? (
              <div className="text-center">
                <p className="text-cream-500 mb-5 text-sm">Connectez-vous pour postuler</p>
                <Link to="/login">
                  <Button className="w-full">Se connecter</Button>
                </Link>
                <Link to="/register?role=performer" className="block mt-3">
                  <Button variant="outline" className="w-full">Creer un compte</Button>
                </Link>
              </div>
            ) : user.role !== "performer" ? (
              <div className="text-center">
                <p className="text-cream-500 text-sm">Seuls les performeurs peuvent postuler</p>
              </div>
            ) : applied ? (
              <div className="text-center">
                <div className="w-12 h-12 border border-jade-600/40 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-5 h-5 text-jade-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-display font-semibold text-cream-100 mb-1">Candidature envoyee</h3>
                <p className="text-xs text-cream-500">Vous serez notifie de la suite.</p>
                <Link to="/performer/applications" className="block mt-5">
                  <Button variant="outline" className="w-full" size="sm">Voir mes candidatures</Button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-5">
                <h3 className="font-display font-semibold text-cream-100">Postuler a cette offre</h3>
                {error && (
                  <div className="p-3 bg-wine-700/20 border border-wine-700/30 text-wine-400 text-sm">{error}</div>
                )}
                <Textarea
                  label="Message de motivation"
                  rows={4}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  placeholder="Pourquoi etes-vous le candidat ideal ?"
                />
                <Button type="submit" className="w-full" disabled={applying}>
                  {applying ? "Envoi..." : "Envoyer ma candidature"}
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
