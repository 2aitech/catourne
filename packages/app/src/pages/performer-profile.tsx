import { useEffect, useState } from "react";
import { request } from "../lib/api";
import type { PerformerProfile, PerformerProfileInput } from "../lib/types";
import { Button, Input, Textarea, Card, Badge, PageContainer } from "../components/ui";

export function PerformerProfilePage() {
  const [profile, setProfile] = useState<PerformerProfile | null>(null);
  const [form, setForm] = useState<PerformerProfileInput>({
    stage_name: "",
    city: "",
    specialty: "",
    languages: "",
    photo_url: "",
    bio: "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    request<{ profile: PerformerProfile }>("/performers/me")
      .then((data) => {
        setProfile(data.profile);
        if (data.profile) {
          setForm({
            stage_name: data.profile.stage_name ?? "",
            city: data.profile.city ?? "",
            specialty: data.profile.specialty ?? "",
            languages: (data.profile.languages ?? []).join(", "),
            photo_url: data.profile.photo_url ?? "",
            bio: data.profile.bio ?? "",
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const data = await request<{ profile: PerformerProfile }>("/performers/me", {
        method: "PATCH",
        body: form,
      });
      setProfile(data.profile);
      setSuccess("Profil mis a jour avec succes !");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const handleSuggestBio = async () => {
    setAiLoading(true);
    try {
      const data = await request<{ suggestions: string[] }>("/ai/suggest-profile-bio", {
        method: "POST",
        body: {
          stage_name: form.stage_name,
          specialty: form.specialty,
          city: form.city,
          languages: form.languages,
          experience: "experience en projets locaux",
        },
      });
      if (data.suggestions?.length) {
        setForm((prev) => ({ ...prev, bio: data.suggestions[0] ?? prev.bio }));
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setAiLoading(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    setUploadingPhoto(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      body.append("photo", file);
      const data = await request<{ photo_url: string; profile: PerformerProfile }>(
        "/uploads/performer-photo",
        {
          method: "POST",
          body,
        },
      );
      setProfile(data.profile);
      setForm((prev) => ({ ...prev, photo_url: data.photo_url }));
      setSuccess("Photo importee avec succes.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingPhoto(false);
      e.target.value = "";
    }
  };

  const score = profile?.completion_score ?? 0;

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">Espace performeur</p>
          <h1 className="font-display text-3xl font-bold text-cream-100">Mon profil</h1>
          <p className="text-cream-500 mt-3 text-sm">Completez votre profil pour augmenter votre visibilite</p>
        </div>

        {/* Completion score */}
        <Card className="p-5 mb-7">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium uppercase tracking-widest text-cream-400">Completion du profil</span>
            <Badge color={score >= 80 ? "green" : score >= 50 ? "accent" : "red"}>
              {score}%
            </Badge>
          </div>
          <div className="w-full bg-noir-700 h-1">
            <div
              className="bg-gold-500 h-1 transition-all duration-500"
              style={{ width: `${score}%` }}
            />
          </div>
        </Card>

        {/* Form */}
        <Card className="p-7 sm:p-9">
          <form onSubmit={handleSave} className="space-y-6">
            {error && (
              <div className="p-3 bg-wine-700/20 border border-wine-700/30 text-wine-400 text-sm">{error}</div>
            )}
            {success && (
              <div className="p-3 bg-jade-600/15 border border-jade-600/20 text-jade-500 text-sm">{success}</div>
            )}

            <Input
              label="Nom de scene"
              type="text"
              value={form.stage_name}
              onChange={(e) => setForm((p) => ({ ...p, stage_name: e.target.value }))}
              placeholder="Votre nom artistique"
            />
            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Ville"
                type="text"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                placeholder="Casablanca, Rabat..."
              />
              <Input
                label="Specialite"
                type="text"
                value={form.specialty}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
                placeholder="Acteur, figurant, danseur..."
              />
            </div>
            <Input
              label="Langues"
              type="text"
              value={form.languages}
              onChange={(e) => setForm((p) => ({ ...p, languages: e.target.value }))}
              placeholder="Arabe, Francais, Anglais..."
            />
            <div className="space-y-3">
              <Input
                label="Photo"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                onChange={handlePhotoUpload}
                disabled={uploadingPhoto}
              />
              <p className="text-xs text-cream-500">
                Formats acceptes: JPG, PNG, WEBP, GIF (max 5 MB).
              </p>
              {uploadingPhoto && (
                <p className="text-xs text-gold-500">Import de la photo en cours...</p>
              )}
              {form.photo_url && (
                <div className="border border-noir-600 bg-noir-800/60 p-3">
                  <p className="text-xs uppercase tracking-widest text-cream-500 mb-3">
                    Apercu
                  </p>
                  <img
                    src={form.photo_url}
                    alt="Photo de profil"
                    className="h-36 w-36 object-cover border border-noir-600"
                  />
                </div>
              )}
            </div>
            <div>
              <Textarea
                label="Bio"
                rows={4}
                value={form.bio}
                onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                placeholder="Parlez de vous, de votre experience, de vos projets..."
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={handleSuggestBio}
                disabled={aiLoading}
              >
                {aiLoading ? "Generation..." : "Suggerer une bio (IA)"}
              </Button>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={saving}>
              {saving ? "Sauvegarde..." : "Sauvegarder le profil"}
            </Button>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
}
