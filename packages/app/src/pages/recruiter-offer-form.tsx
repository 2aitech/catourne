import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { request, toIsoDate } from "../lib/api";
import type { OfferInput } from "../lib/types";
import { Button, Input, Textarea, Select, Card, PageContainer } from "../components/ui";

const PROJECT_TYPES = [
  "Film",
  "Serie TV",
  "Court-metrage",
  "Publicite",
  "Clip musical",
  "Theatre",
  "Evenement",
  "Autre",
];

export function RecruiterOfferFormPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<OfferInput>({
    title: "",
    project_type: "",
    city: "",
    deadline_at_local: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const deadlineAt = toIsoDate(form.deadline_at_local);
    if (!deadlineAt) {
      setError("Date limite invalide.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await request("/offers", {
        method: "POST",
        body: {
          title: form.title.trim(),
          project_type: form.project_type.trim(),
          city: form.city.trim(),
          deadline_at: deadlineAt,
          description: form.description.trim(),
        },
      });
      navigate("/recruiter/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateDescription = async () => {
    setAiLoading(true);
    try {
      const data = await request<{ description: string }>("/ai/generate-offer-description", {
        method: "POST",
        body: {
          project_type: form.project_type,
          role_name: form.title,
          city: form.city,
          constraints: "disponibilite, ponctualite, experience terrain",
        },
      });
      if (data.description) {
        setForm((p) => ({ ...p, description: data.description }));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Nouvelle offre</p>
          <h1 className="font-display text-3xl font-bold text-cream-100">Creer une offre</h1>
          <p className="text-cream-500 mt-3 text-sm">
            Decrivez le role que vous recherchez. L'offre sera creee en brouillon.
          </p>
        </div>

        <Card className="p-7 sm:p-9">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3 bg-wine-700/20 border border-wine-700/30 text-wine-400 text-sm">{error}</div>
            )}

            <Input
              label="Titre de l'offre"
              type="text"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              placeholder="ex: Figurant pour scene de marche"
              required
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Select
                label="Type de projet"
                value={form.project_type}
                onChange={(e) => setForm((p) => ({ ...p, project_type: e.target.value }))}
                required
              >
                <option value="">Choisir...</option>
                {PROJECT_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </Select>
              <Input
                label="Ville"
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder="Casablanca, Rabat..."
                required
              />
            </div>

            <Input
              label="Date limite de candidature"
              type="datetime-local"
              value={form.deadline_at_local}
              onChange={(e) => setForm((p) => ({ ...p, deadline_at_local: e.target.value }))}
              required
            />

            <div>
              <Textarea
                label="Description"
                rows={6}
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Decrivez le role, les exigences, les conditions..."
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={handleGenerateDescription}
                disabled={aiLoading || !form.title || !form.project_type}
              >
                {aiLoading ? "Generation..." : "Generer la description (IA)"}
              </Button>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="submit" size="lg" className="flex-1" disabled={saving}>
                {saving ? "Creation..." : "Creer l'offre (brouillon)"}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate("/recruiter/dashboard")}
              >
                Annuler
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
