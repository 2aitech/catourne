import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../lib/api";
import type { PerformerApplication } from "../lib/types";
import { Card, Badge, PageContainer, Button, LoadingSpinner } from "../components/ui";

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

export function PerformerApplicationsPage() {
  const [applications, setApplications] = useState<PerformerApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    request<{ applications: PerformerApplication[] }>("/applications/me")
      .then((data) => setApplications(data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Suivi</p>
          <h1 className="font-display text-3xl font-bold text-cream-100">Mes candidatures</h1>
          <p className="text-cream-500 mt-3 text-sm">Suivez l'avancement de vos candidatures</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : applications.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-cream-500 text-lg font-display mb-5">Aucune candidature pour le moment</p>
            <Link to="/offers">
              <Button>Parcourir les offres</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4 stagger-children">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 hover:border-noir-600 transition-colors duration-200">
                <div className="flex items-start justify-between">
                  <div>
                    <Link to={`/offers/${app.offer_id}`} className="hover:text-gold-400 transition-colors duration-200">
                      <h3 className="font-display font-semibold text-cream-100">{app.offer_title}</h3>
                    </Link>
                    <p className="text-xs text-cream-500 mt-1.5 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {app.offer_city}
                    </p>
                  </div>
                  <Badge color={statusColors[app.status] ?? "gray"}>
                    {statusLabels[app.status] ?? app.status}
                  </Badge>
                </div>
                {app.motivation_text && (
                  <p className="text-sm text-cream-500 mt-4 italic border-l border-gold-700/40 pl-4">
                    {app.motivation_text}
                  </p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
