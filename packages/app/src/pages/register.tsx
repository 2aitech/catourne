import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { request } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import type { Role } from "../lib/types";
import { Input, Select } from "../components/ui";
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, ImagePlus } from "lucide-react";
import logo from "../assets/LOGOS/LOGO-06.png";

const SPECIALTY_OPTIONS = [
  "Acteur/Actrice", "Figurant", "Danseur", "Chanteur",
  "Mannequin", "Cascadeur", "Voix off", "Technicien", "Autre",
];
const CITY_OPTIONS = [
  "Casablanca", "Rabat", "Marrakech", "Tanger", "Fes", "Agadir",
  "Meknes", "Oujda", "Kenitra", "Tetouan", "Ouarzazate", "Rachidia",
];
const LANGUAGE_OPTIONS = [
  "Arabe", "Francais", "Anglais", "Espagnol", "Amazigh", "Italien", "Allemand", "Portugais",
];
const GENDER_OPTIONS = ["Homme", "Femme", "Autre"];

const MAX_GALLERY_FILES = 12;
const MAX_GALLERY_PREVIEW_TILES = 4;
const PERFORMER_FORM_STEPS = ["Compte", "Profil", "Mensurations", "Photos"];
const RECRUITER_FORM_STEPS = ["Compte"];

export function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get("role") as Role | null;

  const [step, setStep] = useState<1 | 2>(preselectedRole ? 2 : 1);
  const [role, setRole] = useState<Role>(preselectedRole ?? "performer");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [phone, setPhone] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [neckCircumferenceCm, setNeckCircumferenceCm] = useState("");
  const [pantLengthCm, setPantLengthCm] = useState("");
  const [headCircumferenceCm, setHeadCircumferenceCm] = useState("");
  const [chestCircumferenceCm, setChestCircumferenceCm] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [galleryPhotos, setGalleryPhotos] = useState<File[]>([]);
  const [profilePreviewUrl, setProfilePreviewUrl] = useState("");
  const [galleryPreviewUrls, setGalleryPreviewUrls] = useState<string[]>([]);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [performerSetupInProgress, setPerformerSetupInProgress] = useState(false);

  useEffect(() => {
    if (!profilePhoto) { setProfilePreviewUrl(""); return; }
    const url = URL.createObjectURL(profilePhoto);
    setProfilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  useEffect(() => {
    if (galleryPhotos.length === 0) { setGalleryPreviewUrls([]); return; }
    const urls = galleryPhotos.map((f) => URL.createObjectURL(f));
    setGalleryPreviewUrls(urls);
    return () => { for (const u of urls) URL.revokeObjectURL(u); };
  }, [galleryPhotos]);

  useEffect(() => {
    if (!galleryModalOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") setGalleryModalOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [galleryModalOpen]);

  const formStepLabels = role === "performer" ? PERFORMER_FORM_STEPS : RECRUITER_FORM_STEPS;
  const totalFormSteps = formStepLabels.length;
  const isLastFormStep = formStep === totalFormSteps;
  const recentGalleryPreviewUrls = [...galleryPreviewUrls].reverse();
  const visibleGalleryPreviewUrls = recentGalleryPreviewUrls.slice(0, MAX_GALLERY_PREVIEW_TILES);
  const hiddenGalleryImagesCount = Math.max(recentGalleryPreviewUrls.length - MAX_GALLERY_PREVIEW_TILES, 0);

  if (user && !performerSetupInProgress) {
    const dest = user.role === "recruiter" ? "/recruiter/dashboard" : user.role === "admin" ? "/admin/reports" : "/performer/profile";
    return <Navigate to={dest} replace />;
  }

  const selectRole = (r: Role) => { setRole(r); setStep(2); setFormStep(1); setError(""); };
  const handleLanguageToggle = (l: string) => setLanguages((p) => p.includes(l) ? p.filter((x) => x !== l) : [...p, l]);
  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => setProfilePhoto(e.target.files?.[0] ?? null);
  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setGalleryPhotos((prev) => {
      const merged = [...prev, ...files];
      const deduped = merged.filter((f, i, all) => all.findIndex((c) => c.name === f.name && c.size === f.size && c.lastModified === f.lastModified) === i);
      return deduped.slice(0, MAX_GALLERY_FILES);
    });
    e.target.value = "";
  };

  const validateAccountStep = () => {
    if (!firstName.trim()) return "Le prénom est obligatoire.";
    if (!lastName.trim()) return "Le nom est obligatoire.";
    if (!email.trim()) return "L'email est obligatoire.";
    if (!password) return "Le mot de passe est obligatoire.";
    if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caracteres.";
    return "";
  };
  const validatePerformerStep = (s: number) => {
    if (s === 1) return validateAccountStep();
    if (s === 2 && (!specialty || !gender || !city || !languages.length || !phone)) return "Specialite, genre, ville, langues et telephone sont obligatoires.";
    if (s === 3 && (!heightCm || !weightKg || !neckCircumferenceCm || !pantLengthCm || !headCircumferenceCm || !chestCircumferenceCm || !shoeSize)) return "Toutes les mensurations sont obligatoires.";
    if (s === 4 && !profilePhoto) return "La photo de profil est obligatoire.";
    return "";
  };
  const validateCurrentStep = () => role === "performer" ? validatePerformerStep(formStep) : validateAccountStep();
  const validateFullPerformerForm = () => {
    for (let s = 1; s <= PERFORMER_FORM_STEPS.length; s++) { const m = validatePerformerStep(s); if (m) return m; }
    return "";
  };
  const handleNextStep = () => {
    const err = validateCurrentStep();
    if (err) { setError(err); return; }
    setError(""); setFormStep((p) => Math.min(p + 1, totalFormSteps));
  };
  const handlePreviousStep = () => { setError(""); setFormStep((p) => Math.max(p - 1, 1)); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    const accountError = validateAccountStep();
    if (accountError) { setError(accountError); return; }
    if (role === "performer") { const pe = validateFullPerformerForm(); if (pe) { setError(pe); return; } }
    if (!isLastFormStep) { handleNextStep(); return; }
    setLoading(true); setPerformerSetupInProgress(role === "performer");
    try {
      await register(email.trim(), password, role);
      if (role === "performer") {
        await request("/performers/me", { method: "PATCH", body: { first_name: firstName.trim(), last_name: lastName.trim(), specialty, gender, city, languages, phone, height_cm: heightCm, weight_kg: weightKg, neck_circumference_cm: neckCircumferenceCm, pant_length_cm: pantLengthCm, head_circumference_cm: headCircumferenceCm, chest_circumference_cm: chestCircumferenceCm, shoe_size: shoeSize } });
        if (profilePhoto) { const b = new FormData(); b.append("photo", profilePhoto); await request("/uploads/performer-photo", { method: "POST", body: b }); }
        if (galleryPhotos.length > 0) { const b = new FormData(); for (const p of galleryPhotos) b.append("photos", p); await request("/uploads/performer-gallery", { method: "POST", body: b }); }
      }
      navigate(role === "recruiter" ? "/recruiter/dashboard" : "/performer/profile");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false); setPerformerSetupInProgress(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100dvh-68px)] flex bg-noir-950 overflow-x-hidden">

        {/* ── Left panel: cinematic ──────────────────────────── */}
        <div className="hidden lg:flex lg:w-[42%] xl:w-[38%] relative flex-col overflow-hidden shrink-0">
          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1200')" }}
          />
          <div className="absolute inset-0 bg-noir-950/70" />
          <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-noir-950/30 to-noir-950/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-noir-950/40 to-transparent" />
          {/* Gold radial */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_70%,rgba(194,142,76,0.12),transparent)] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full p-10 xl:p-12">
            {/* Top: empty spacer */}
            <div />

            {/* Center: headline */}
            <div>
              <Link to="/" className="inline-block mb-6">
                <img src={logo} alt="CATOURNE" className="w-14 h-14 rounded-2xl object-cover shadow-xl shadow-gold-500/25" />
              </Link>
              <div className="flex items-center gap-3 mb-5">
                <span className="h-px w-8 bg-gold-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-400">Plateforme de casting</span>
              </div>
              <h2 className="font-serif font-bold text-cream-50 leading-tight mb-4" style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}>
                Donnez vie à<br />
                votre talent.
              </h2>
              <p className="text-cream-400 text-sm leading-relaxed max-w-xs">
                Rejoignez +500 talents et recruteurs qui font confiance à CATOURNE pour leurs castings au Maroc.
              </p>
            </div>

            {/* Bottom: social proof card */}
            <div className="rounded-2xl border border-white/10 bg-noir-900/60 backdrop-blur-md p-5">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=80&auto=format&fit=crop"
                  alt="Amina"
                  className="w-9 h-9 rounded-full object-cover border border-gold-500/30"
                />
                <div>
                  <p className="text-cream-100 text-xs font-semibold">Amina El Idrissi</p>
                  <p className="text-gold-400 text-[10px] font-medium">Actrice · Casablanca</p>
                </div>
                <div className="ml-auto flex items-center gap-1 bg-gold-500/10 border border-gold-500/20 rounded-full px-2.5 py-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-gold-400">Actif</span>
                </div>
              </div>
              <p className="text-cream-500 text-xs leading-relaxed italic">
                "Grâce à CATOURNE, j'ai décroché mon premier rôle en moins de deux semaines."
              </p>
            </div>
          </div>

          {/* Right edge fade */}
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-noir-950 to-transparent pointer-events-none" />
        </div>

        {/* ── Right panel: form ──────────────────────────────── */}
        <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-lg">

            {/* Mobile logo */}
            <div className="flex flex-col items-center mb-8 lg:hidden">
              <Link to="/" className="inline-flex items-center mb-1">
                <img src={logo} alt="CATOURNE" className="w-9 h-9 rounded-xl object-cover shadow-gold-500/20 shadow-lg" />
              </Link>
            </div>

            {/* Heading */}
            <div className="mb-8">
              {/* Desktop: small logo */}
              <Link to="/" className="hidden lg:inline-flex items-center mb-6">
                <img src={logo} alt="CATOURNE" className="w-8 h-8 rounded-lg object-cover shadow-gold-500/20 shadow-md" />
              </Link>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50 mb-1.5">
                {step === 1 ? "Créer votre compte" : role === "performer" ? "Inscription Talent" : "Inscription Recruteur"}
              </h1>
              <p className="text-cream-500 text-sm">
                {step === 1 ? "Choisissez votre profil pour commencer" : "Complétez les informations ci-dessous"}
              </p>
            </div>

            {/* ── Step 1: Role selection ── */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-4">
                <RoleCard
                  title="Je suis Talent"
                  description="Acteur, figurant, mannequin ou technicien — trouvez des opportunités de casting."
                  badge="Performeur"
                  image="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=300&auto=format&fit=crop"
                  onClick={() => selectRole("performer")}
                />
                <RoleCard
                  title="Je suis Recruteur"
                  description="Producteur, réalisateur ou directeur de casting — trouvez les meilleurs talents."
                  badge="Recruteur"
                  image="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=300"
                  onClick={() => selectRole("recruiter")}
                />
              </div>
            )}

            {/* ── Step 2: Form ── */}
            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Step indicator */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    {formStepLabels.map((label, index) => {
                      const s = index + 1;
                      const active = s === formStep;
                      const done = s < formStep;
                      return (
                        <div key={label} className="flex items-center flex-1 last:flex-none">
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                              done ? "bg-gold-500 text-noir-950" : active ? "bg-gold-500/20 border-2 border-gold-500 text-gold-400" : "bg-white/6 border border-white/10 text-neutral-500"
                            }`}>
                              {done ? <CheckCircle2 className="w-4 h-4" /> : s}
                            </div>
                            <span className={`text-[9px] font-semibold uppercase tracking-wider hidden sm:block ${active ? "text-gold-400" : done ? "text-gold-600" : "text-neutral-600"}`}>
                              {label}
                            </span>
                          </div>
                          {index < formStepLabels.length - 1 && (
                            <div className="flex-1 mx-2 h-px mt-[-14px]" style={{ background: s < formStep ? "rgba(194,142,76,0.6)" : "rgba(255,255,255,0.08)" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/8 border border-red-500/20 text-red-400 text-sm">
                    <span className="shrink-0 mt-0.5">⚠</span>
                    {error}
                  </div>
                )}

                {/* ── Compte ── */}
                {formStep === 1 && (
                  <div className="space-y-4">
                    {/* Nom / Prénom */}
                    <div className="grid grid-cols-2 gap-3">
                      <FormField label="Prénom">
                        <input
                          type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Youssef" required autoComplete="given-name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                        />
                      </FormField>
                      <FormField label="Nom">
                        <input
                          type="text" value={lastName} onChange={(e) => setLastName(e.target.value)}
                          placeholder="Benali" required autoComplete="family-name"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                        />
                      </FormField>
                    </div>
                    <FormField label="Adresse email">
                      <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        placeholder="votre@email.com" required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                      />
                    </FormField>
                    <FormField label="Mot de passe">
                      <input
                        type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Minimum 8 caractères" minLength={8} required
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                      />
                    </FormField>
                  </div>
                )}

                {/* ── Profil ── */}
                {role === "performer" && formStep === 2 && (
                  <div className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField label="Spécialité">
                        <StyledSelect value={specialty} onChange={(e) => setSpecialty(e.target.value)} required>
                          <option value="">Choisir...</option>
                          {SPECIALTY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </StyledSelect>
                      </FormField>
                      <FormField label="Genre">
                        <StyledSelect value={gender} onChange={(e) => setGender(e.target.value)} required>
                          <option value="">Choisir...</option>
                          {GENDER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </StyledSelect>
                      </FormField>
                      <FormField label="Ville">
                        <StyledSelect value={city} onChange={(e) => setCity(e.target.value)} required>
                          <option value="">Choisir...</option>
                          {CITY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                        </StyledSelect>
                      </FormField>
                      <FormField label="Téléphone">
                        <input
                          type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                          placeholder="0600000000" required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                        />
                      </FormField>
                    </div>
                    <FormField label="Langues parlées">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1">
                        {LANGUAGE_OPTIONS.map((l) => {
                          const checked = languages.includes(l);
                          return (
                            <button
                              key={l} type="button"
                              onClick={() => handleLanguageToggle(l)}
                              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                                checked ? "bg-gold-500/15 border-gold-500/50 text-gold-400" : "bg-white/4 border-white/8 text-neutral-400 hover:border-white/20 hover:text-cream-300"
                              }`}
                            >
                              {checked && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                              {l}
                            </button>
                          );
                        })}
                      </div>
                    </FormField>
                  </div>
                )}

                {/* ── Mensurations ── */}
                {role === "performer" && formStep === 3 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[
                      { label: "Taille (cm)", value: heightCm, set: setHeightCm, placeholder: "178" },
                      { label: "Poids (kg)", value: weightKg, set: setWeightKg, placeholder: "70" },
                      { label: "Tour de cou (cm)", value: neckCircumferenceCm, set: setNeckCircumferenceCm, placeholder: "38" },
                      { label: "Longueur pantalon (cm)", value: pantLengthCm, set: setPantLengthCm, placeholder: "94" },
                      { label: "Tour de tête (cm)", value: headCircumferenceCm, set: setHeadCircumferenceCm, placeholder: "59" },
                      { label: "Tour de poitrine (cm)", value: chestCircumferenceCm, set: setChestCircumferenceCm, placeholder: "88" },
                      { label: "Pointure chaussures", value: shoeSize, set: setShoeSize, placeholder: "42" },
                    ].map(({ label, value, set, placeholder }) => (
                      <FormField key={label} label={label}>
                        <input
                          type="number" min={1} value={value} onChange={(e) => set(e.target.value)}
                          placeholder={placeholder} required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 placeholder:text-neutral-600 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
                        />
                      </FormField>
                    ))}
                  </div>
                )}

                {/* ── Photos ── */}
                {role === "performer" && formStep === 4 && (
                  <div className="space-y-5">
                    {/* Profile photo */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Photo de profil *</p>
                      <label className={`flex flex-col items-center justify-center gap-3 h-36 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 ${profilePreviewUrl ? "border-gold-500/40 bg-gold-500/5" : "border-white/10 bg-white/3 hover:border-gold-500/30 hover:bg-white/5"}`}>
                        {profilePreviewUrl ? (
                          <img src={profilePreviewUrl} alt="Aperçu" className="h-full w-full object-cover rounded-2xl" />
                        ) : (
                          <>
                            <Upload className="w-6 h-6 text-neutral-500" />
                            <div className="text-center">
                              <p className="text-sm text-cream-300 font-medium">Cliquez pour choisir</p>
                              <p className="text-xs text-neutral-500 mt-0.5">JPG, PNG, WEBP · max 5 MB</p>
                            </div>
                          </>
                        )}
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handleProfilePhotoChange} className="hidden" required />
                      </label>
                      {profilePhoto && (
                        <p className="text-xs text-gold-400 mt-2 font-medium">✓ {profilePhoto.name}</p>
                      )}
                    </div>

                    {/* Gallery */}
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-3">Galerie photos <span className="text-neutral-600 normal-case font-normal tracking-normal">(optionnel, 12 max)</span></p>
                      <label className="flex flex-col items-center justify-center gap-3 h-28 rounded-2xl border-2 border-dashed border-white/10 bg-white/3 cursor-pointer hover:border-gold-500/30 hover:bg-white/5 transition-all duration-200">
                        <ImagePlus className="w-5 h-5 text-neutral-500" />
                        <p className="text-sm text-cream-300 font-medium">Ajouter des photos</p>
                        <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple onChange={handleGalleryPhotosChange} className="hidden" />
                      </label>
                      {galleryPhotos.length > 0 && (
                        <div className="mt-3">
                          <div className="grid grid-cols-4 gap-2">
                            {visibleGalleryPreviewUrls.map((url, index) => {
                              const isOverlay = hiddenGalleryImagesCount > 0 && index === visibleGalleryPreviewUrls.length - 1;
                              return isOverlay ? (
                                <button key={`${url}-${index}`} type="button" onClick={() => setGalleryModalOpen(true)}
                                  className="relative h-20 w-full rounded-xl overflow-hidden border border-white/10 cursor-pointer">
                                  <img src={url} alt="" className="h-full w-full object-cover" />
                                  <span className="absolute inset-0 flex items-center justify-center bg-noir-950/70 text-cream-100 text-lg font-bold">+{hiddenGalleryImagesCount}</span>
                                </button>
                              ) : (
                                <img key={`${url}-${index}`} src={url} alt="" className="h-20 w-full rounded-xl object-cover border border-white/10" />
                              );
                            })}
                          </div>
                          <p className="text-xs text-gold-400 mt-2 font-medium">✓ {galleryPhotos.length} photo(s) sélectionnée(s)</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-1">
                  {role === "performer" && formStep > 1 && (
                    <button type="button" onClick={handlePreviousStep}
                      className="flex items-center gap-2 px-5 py-3.5 rounded-2xl border border-white/10 bg-white/4 text-cream-300 text-sm font-semibold hover:bg-white/8 hover:text-cream-100 transition-all">
                      <ChevronLeft className="w-4 h-4" />
                      Retour
                    </button>
                  )}
                  {role === "performer" && !isLastFormStep ? (
                    <button type="button" onClick={handleNextStep}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gold-500 text-noir-950 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold-500/20">
                      Continuer
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button type="submit" disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gold-500 text-noir-950 text-sm font-bold uppercase tracking-widest hover:bg-gold-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-gold-500/20 disabled:opacity-50 disabled:pointer-events-none">
                      {loading ? (
                        <><span className="w-4 h-4 border-2 border-noir-950/30 border-t-noir-950 rounded-full animate-spin" />Création...</>
                      ) : "Créer mon compte"}
                    </button>
                  )}
                </div>

                {!preselectedRole && (
                  <button type="button" onClick={() => { setStep(1); setFormStep(1); setError(""); }}
                    className="w-full text-center text-xs text-neutral-500 hover:text-gold-400 transition-colors py-1">
                    ← Changer de profil
                  </button>
                )}
              </form>
            )}

            <p className="text-center mt-8 text-sm text-neutral-500">
              Déjà inscrit ?{" "}
              <Link to="/login" className="text-gold-400 font-semibold hover:text-gold-300 transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Gallery modal */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-noir-950/85 backdrop-blur-md flex items-center justify-center p-5" onClick={() => setGalleryModalOpen(false)}>
          <div className="w-full max-w-3xl max-h-[85vh] overflow-auto bg-noir-900 border border-white/10 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-cream-100 font-serif text-lg font-bold">Galerie complète ({recentGalleryPreviewUrls.length})</h3>
              <button type="button" onClick={() => setGalleryModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest text-cream-300 hover:text-cream-100 hover:border-white/20 transition-all">
                Fermer
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recentGalleryPreviewUrls.map((url, i) => (
                <img key={`modal-${url}-${i}`} src={url} alt={`Galerie ${i + 1}`} className="h-36 w-full rounded-2xl object-cover border border-white/8" />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── Sub-components ─────────────────────────────────────────── */

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-widest text-neutral-400 mb-2">{label}</label>
      {children}
    </div>
  );
}

function StyledSelect({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-sm text-cream-100 focus:border-gold-500/60 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all appearance-none"
    >
      {children}
    </select>
  );
}

function RoleCard({ title, description, badge, image, onClick }: {
  title: string; description: string; badge: string; image: string; onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick}
      className="relative group text-left rounded-3xl overflow-hidden border border-white/10 hover:border-gold-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/10 active:scale-[0.98]"
      style={{ minHeight: 220 }}
    >
      {/* Background portrait */}
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/95 via-noir-950/50 to-noir-950/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/60 to-transparent group-hover:from-noir-950/40 transition-all duration-300" />

      {/* Badge */}
      <div className="absolute top-4 left-4">
        <span className="px-3 py-1 rounded-full bg-gold-500/15 border border-gold-500/30 text-[10px] font-bold uppercase tracking-widest text-gold-400">
          {badge}
        </span>
      </div>

      {/* Arrow */}
      <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-1 group-hover:translate-x-0">
        <ChevronRight className="w-4 h-4 text-cream-200" />
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <h3 className="font-serif text-base font-bold text-cream-50 mb-1">{title}</h3>
        <p className="text-xs text-cream-400 leading-relaxed">{description}</p>
      </div>
    </button>
  );
}
