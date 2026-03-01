import { useEffect, useState } from "react";
import { request, getApiBase } from "../lib/api";
import type { PerformerProfile, PerformerProfileInput } from "../lib/types";
import { Button, Input, Textarea, Card, Badge, Select, PageContainer } from "../components/ui";

const SPECIALTY_OPTIONS = [
  "Acteur/Actrice",
  "Figurant",
  "Danseur",
  "Chanteur",
  "Mannequin",
  "Cascadeur",
  "Voix off",
  "Technicien",
  "Autre",
];

const CITY_OPTIONS = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Tanger",
  "Fes",
  "Agadir",
  "Meknes",
  "Oujda",
  "Kenitra",
  "Tetouan",
  "Ouarzazate",
  "Rachidia",
];

const LANGUAGE_OPTIONS = [
  "Arabe",
  "Francais",
  "Anglais",
  "Espagnol",
  "Amazigh",
  "Italien",
  "Allemand",
  "Portugais",
];

const GENDER_OPTIONS = ["Homme", "Femme", "Autre"];

const MAX_GALLERY_FILES = 12;

export function PerformerProfilePage() {
  const [profile, setProfile] = useState<PerformerProfile | null>(null);
  const [form, setForm] = useState<PerformerProfileInput>({
    stage_name: "",
    gender: "",
    city: "",
    specialty: "",
    languages: [],
    phone: "",
    height_cm: "",
    weight_kg: "",
    neck_circumference_cm: "",
    pant_length_cm: "",
    head_circumference_cm: "",
    chest_circumference_cm: "",
    shoe_size: "",
    photo_url: "",
    bio: "",
  });
  const [galleryUrls, setGalleryUrls] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  useEffect(() => {
    request<{ profile: PerformerProfile }>("/performers/me")
      .then((data) => {
        setProfile(data.profile);
        if (data.profile) {
          setForm({
            stage_name: data.profile.stage_name ?? "",
            gender: data.profile.gender ?? "",
            city: data.profile.city ?? "",
            specialty: data.profile.specialty ?? "",
            languages: data.profile.languages ?? [],
            phone: data.profile.phone ?? "",
            height_cm: data.profile.height_cm ?? "",
            weight_kg: data.profile.weight_kg ?? "",
            neck_circumference_cm: data.profile.neck_circumference_cm ?? "",
            pant_length_cm: data.profile.pant_length_cm ?? "",
            head_circumference_cm: data.profile.head_circumference_cm ?? "",
            chest_circumference_cm: data.profile.chest_circumference_cm ?? "",
            shoe_size: data.profile.shoe_size ?? "",
            photo_url: data.profile.photo_url ?? "",
            bio: data.profile.bio ?? "",
          });
        }
      })
      .catch(() => {});

    request<{ images: string[] }>("/uploads/performer-gallery/me")
      .then((data) => setGalleryUrls(data.images ?? []))
      .catch(() => {});
  }, []);

  const handleLanguageToggle = (language: string) => {
    setForm((prev) => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter((l) => l !== language)
        : [...prev.languages, language],
    }));
  };

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
          languages: form.languages.join(", "),
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
    if (!file) return;
    setUploadingPhoto(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      body.append("photo", file);
      const data = await request<{ photo_url: string; profile: PerformerProfile }>(
        "/uploads/performer-photo",
        { method: "POST", body },
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

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setUploadingGallery(true);
    setError("");
    setSuccess("");
    try {
      const body = new FormData();
      for (const photo of files.slice(0, MAX_GALLERY_FILES)) {
        body.append("photos", photo);
      }
      const data = await request<{ gallery_urls: string[] }>(
        "/uploads/performer-gallery",
        { method: "POST", body },
      );
      setGalleryUrls(data.gallery_urls ?? []);
      setSuccess("Photos de galerie importees avec succes.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const score = profile?.completion_score ?? 0;
  const photoSrc = form.photo_url
    ? form.photo_url.startsWith("http")
      ? form.photo_url
      : `${getApiBase()}${form.photo_url}`
    : "";

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

            {/* --- Profil --- */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-400 border-b border-noir-700 pb-2">
              Profil
            </p>

            <Input
              label="Nom de scene"
              type="text"
              value={form.stage_name}
              onChange={(e) => setForm((p) => ({ ...p, stage_name: e.target.value }))}
              placeholder="Votre nom artistique"
            />

            <div className="grid sm:grid-cols-2 gap-5">
              <Select
                label="Specialite"
                value={form.specialty}
                onChange={(e) => setForm((p) => ({ ...p, specialty: e.target.value }))}
              >
                <option value="">Choisir...</option>
                {SPECIALTY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              <Select
                label="Ville"
                value={form.city}
                onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
              >
                <option value="">Choisir...</option>
                {CITY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
              <Select
                label="Genre"
                value={form.gender}
                onChange={(e) => setForm((p) => ({ ...p, gender: e.target.value }))}
              >
                <option value="">Choisir...</option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </Select>
            </div>

            <div>
              <span className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">
                Langues
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGE_OPTIONS.map((option) => {
                  const checked = form.languages.includes(option);
                  return (
                    <label
                      key={option}
                      className="flex items-center gap-2 rounded-sm border border-noir-600 bg-noir-800 px-3 py-2 text-sm text-cream-100"
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-gold-500"
                        checked={checked}
                        onChange={() => handleLanguageToggle(option)}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <Input
              label="Telephone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
              placeholder="0600752594"
            />

            {/* --- Mensurations --- */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-400 border-b border-noir-700 pb-2 pt-4">
              Mensurations
            </p>

            <div className="grid sm:grid-cols-2 gap-5">
              <Input
                label="Taille (cm)"
                type="number"
                min={1}
                value={form.height_cm}
                onChange={(e) => setForm((p) => ({ ...p, height_cm: e.target.value }))}
                placeholder="178"
              />
              <Input
                label="Poids (kg)"
                type="number"
                min={1}
                step="0.1"
                value={form.weight_kg}
                onChange={(e) => setForm((p) => ({ ...p, weight_kg: e.target.value }))}
                placeholder="70"
              />
              <Input
                label="Tour de cou (cm)"
                type="number"
                min={1}
                value={form.neck_circumference_cm}
                onChange={(e) => setForm((p) => ({ ...p, neck_circumference_cm: e.target.value }))}
                placeholder="38"
              />
              <Input
                label="Longueur pantalon (cm)"
                type="number"
                min={1}
                value={form.pant_length_cm}
                onChange={(e) => setForm((p) => ({ ...p, pant_length_cm: e.target.value }))}
                placeholder="94"
              />
              <Input
                label="Tour de tete (cm)"
                type="number"
                min={1}
                value={form.head_circumference_cm}
                onChange={(e) => setForm((p) => ({ ...p, head_circumference_cm: e.target.value }))}
                placeholder="59"
              />
              <Input
                label="Tour de poitrine (cm)"
                type="number"
                min={1}
                value={form.chest_circumference_cm}
                onChange={(e) => setForm((p) => ({ ...p, chest_circumference_cm: e.target.value }))}
                placeholder="88"
              />
              <Input
                label="Pointure chaussures"
                type="number"
                min={1}
                value={form.shoe_size}
                onChange={(e) => setForm((p) => ({ ...p, shoe_size: e.target.value }))}
                placeholder="42"
              />
            </div>

            {/* --- Photos --- */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-400 border-b border-noir-700 pb-2 pt-4">
              Photos
            </p>

            <div className="space-y-3">
              <Input
                label="Photo de profil"
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
              {photoSrc && (
                <div className="border border-noir-600 bg-noir-800/60 p-3">
                  <p className="text-xs uppercase tracking-widest text-cream-500 mb-3">Apercu</p>
                  <img
                    src={photoSrc}
                    alt="Photo de profil"
                    className="h-36 w-36 object-cover border border-noir-600"
                  />
                </div>
              )}
            </div>

            <div className="space-y-3">
              <Input
                label="Galerie (photos)"
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                multiple
                onChange={handleGalleryUpload}
                disabled={uploadingGallery}
              />
              <p className="text-xs text-cream-500">
                Optionnel, 12 photos max par envoi.
              </p>
              {uploadingGallery && (
                <p className="text-xs text-gold-500">Import des photos en cours...</p>
              )}
              {galleryUrls.length > 0 && (
                <div className="border border-noir-600 bg-noir-800/60 p-3">
                  <p className="text-xs uppercase tracking-widest text-cream-500 mb-3">
                    Galerie ({galleryUrls.length})
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {galleryUrls.map((url) => {
                      const src = url.startsWith("http") ? url : `${getApiBase()}${url}`;
                      return (
                        <img
                          key={url}
                          src={src}
                          alt="Galerie"
                          className="h-20 w-full rounded-sm object-cover border border-noir-600"
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* --- Bio --- */}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cream-400 border-b border-noir-700 pb-2 pt-4">
              Bio
            </p>

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
