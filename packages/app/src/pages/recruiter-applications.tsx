import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { request } from "../lib/api";
import type { RecruiterApplication } from "../lib/types";
import { Button, Card, Badge, PageContainer, LoadingSpinner } from "../components/ui";

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

type StatusAction = {
  label: string;
  value: "in_review" | "shortlisted" | "rejected" | "selected";
  variant: "primary" | "secondary" | "danger" | "outline";
};

function getStatusActions(status: string): StatusAction[] {
  if (status === "submitted")
    return [{ label: "Passer en revue", value: "in_review", variant: "primary" }];
  if (status === "in_review")
    return [
      { label: "Preselectionner", value: "shortlisted", variant: "secondary" },
      { label: "Rejeter", value: "rejected", variant: "danger" },
    ];
  if (status === "shortlisted")
    return [
      { label: "Selectionner", value: "selected", variant: "primary" },
      { label: "Rejeter", value: "rejected", variant: "danger" },
    ];
  return [];
}

export function RecruiterApplicationsPage() {
  const { offerId } = useParams<{ offerId: string }>();
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadApplications = () => {
    if (!offerId) return;
    request<{ applications: RecruiterApplication[] }>(`/offers/${offerId}/applications`)
      .then((data) => setApplications(data.applications ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadApplications();
  }, [offerId]);

  const handleUpdateStatus = async (
    applicationId: string,
    status: "in_review" | "shortlisted" | "rejected" | "selected",
  ) => {
    try {
      await request(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: { status },
      });
      loadApplications();
    } catch {}
  };

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="max-w-3xl mx-auto">
        <Link to="/recruiter/dashboard" className="text-xs uppercase tracking-widest text-cream-500 hover:text-gold-400 mb-8 inline-flex items-center gap-2 transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
          Retour au tableau de bord
        </Link>

        <div className="mb-10 mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Gestion</p>
          <h1 className="font-display text-3xl font-bold text-cream-100">Candidatures</h1>
          <p className="text-cream-500 mt-3 text-sm">Gerez les candidatures pour cette offre</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : applications.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-cream-500 text-lg font-display">Aucune candidature pour cette offre</p>
          </Card>
        ) : (
          <div className="space-y-4 stagger-children">
            {applications.map((app) => (
              <Card key={app.id} className="p-5 hover:border-noir-600 transition-colors duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-display font-semibold text-cream-100">
                      {app.stage_name || app.performer_user_id}
                    </h3>
                    <p className="text-xs text-cream-500 mt-1.5">
                      {app.city || "Ville non renseignee"} &middot;{" "}
                      {app.specialty || "Specialite non renseignee"} &middot;{" "}
                      Profil {app.completion_score ?? 0}%
                    </p>
                  </div>
                  <Badge color={statusColors[app.status] ?? "gray"}>
                    {statusLabels[app.status] ?? app.status}
                  </Badge>
                </div>

                {app.motivation_text && (
                  <p className="text-sm text-cream-400 border-l border-gold-700/40 pl-4 mb-5 italic">
                    {app.motivation_text}
                  </p>
                )}

                <div className="flex gap-2">
                  {getStatusActions(app.status).map((action) => (
                    <Button
                      key={action.value}
                      variant={action.variant}
                      size="sm"
                      onClick={() => handleUpdateStatus(app.id, action.value)}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
