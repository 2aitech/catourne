import { useEffect, useState } from "react";
import { request, formatDate } from "../lib/api";
import type { ReportItem, ReportInput } from "../lib/types";
import { Button, Input, Card, Badge, PageContainer, LoadingSpinner } from "../components/ui";

export function AdminReportsPage() {
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportForm, setReportForm] = useState<ReportInput>({
    target_type: "",
    target_id: "",
    reason: "",
  });

  const loadReports = () => {
    request<{ reports: ReportItem[] }>("/admin/reports")
      .then((data) => setReports(data.reports ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleAction = async (reportId: string, action: "dismiss" | "warn" | "suspend") => {
    try {
      await request(`/admin/reports/${reportId}/action`, {
        method: "POST",
        body: { action, note: "action via UI" },
      });
      loadReports();
    } catch {}
  };

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await request("/reports", { method: "POST", body: reportForm });
      setReportForm({ target_type: "", target_id: "", reason: "" });
      setShowReportForm(false);
      loadReports();
    } catch {}
  };

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-wine-500 mb-3">Administration</p>
            <h1 className="font-display text-3xl font-bold text-cream-100">Signalements</h1>
            <p className="text-cream-500 mt-3 text-sm">Gestion des signalements</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowReportForm(!showReportForm)}>
              {showReportForm ? "Fermer" : "Creer un signalement"}
            </Button>
            <Button variant="ghost" size="sm" onClick={loadReports}>
              Rafraichir
            </Button>
          </div>
        </div>

        {/* Report form */}
        {showReportForm && (
          <Card className="p-6 mb-7">
            <form onSubmit={handleCreateReport} className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500 mb-3">Nouveau signalement</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Type cible (offer, user, application)"
                  value={reportForm.target_type}
                  onChange={(e) => setReportForm((p) => ({ ...p, target_type: e.target.value }))}
                  required
                />
                <Input
                  type="text"
                  placeholder="ID cible"
                  value={reportForm.target_id}
                  onChange={(e) => setReportForm((p) => ({ ...p, target_id: e.target.value }))}
                  required
                />
              </div>
              <Input
                type="text"
                placeholder="Raison"
                value={reportForm.reason}
                onChange={(e) => setReportForm((p) => ({ ...p, reason: e.target.value }))}
                required
              />
              <Button type="submit" size="sm">Creer</Button>
            </form>
          </Card>
        )}

        {/* Reports list */}
        {loading ? (
          <LoadingSpinner />
        ) : reports.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-cream-500 text-lg font-display">Aucun signalement</p>
          </Card>
        ) : (
          <div className="space-y-4 stagger-children">
            {reports.map((report) => (
              <Card key={report.id} className="p-5 hover:border-noir-600 transition-colors duration-200">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs text-cream-500">
                      {report.reporter_email} &rarr; {report.target_type}:{report.target_id}
                    </p>
                    <p className="font-medium text-cream-200 mt-1.5">{report.reason}</p>
                    <p className="text-[10px] text-cream-500/60 mt-1.5 uppercase tracking-wider">{formatDate(report.created_at)}</p>
                  </div>
                  <Badge color={report.status === "resolved" ? "green" : report.status === "pending" ? "accent" : "gray"}>
                    {report.status}
                  </Badge>
                </div>
                {report.status !== "resolved" && (
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" onClick={() => handleAction(report.id, "dismiss")}>
                      Dismiss
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => handleAction(report.id, "warn")}>
                      Warn
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleAction(report.id, "suspend")}>
                      Suspend
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
