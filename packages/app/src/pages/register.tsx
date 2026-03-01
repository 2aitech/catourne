import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { request } from "../lib/api";
import { useAuth } from "../lib/auth-context";
import type { Role } from "../lib/types";
import { Button, Input, Card, Select } from "../components/ui";

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
    if (!profilePhoto) {
      setProfilePreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(profilePhoto);
    setProfilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [profilePhoto]);

  useEffect(() => {
    if (galleryPhotos.length === 0) {
      setGalleryPreviewUrls([]);
      return;
    }
    const urls = galleryPhotos.map((file) => URL.createObjectURL(file));
    setGalleryPreviewUrls(urls);
    return () => {
      for (const url of urls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [galleryPhotos]);

  useEffect(() => {
    if (!galleryModalOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setGalleryModalOpen(false);
      }
    };
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
    const dest =
      user.role === "recruiter"
        ? "/recruiter/dashboard"
        : user.role === "admin"
          ? "/admin/reports"
          : "/performer/profile";
    return <Navigate to={dest} replace />;
  }

  const selectRole = (r: Role) => {
    setRole(r);
    setStep(2);
    setFormStep(1);
    setError("");
  };

  const handleLanguageToggle = (language: string) => {
    setLanguages((prev) =>
      prev.includes(language)
        ? prev.filter((current) => current !== language)
        : [...prev, language],
    );
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfilePhoto(e.target.files?.[0] ?? null);
  };

  const handleGalleryPhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) {
      return;
    }

    setGalleryPhotos((prev) => {
      const merged = [...prev, ...files];
      const deduped = merged.filter(
        (file, index, all) =>
          all.findIndex(
            (candidate) =>
              candidate.name === file.name &&
              candidate.size === file.size &&
              candidate.lastModified === file.lastModified,
          ) === index,
      );
      return deduped.slice(0, MAX_GALLERY_FILES);
    });

    // Allow re-selecting the same file(s) on the next pick.
    e.target.value = "";
  };

  const validateAccountStep = () => {
    if (!email.trim()) {
      return "L'email est obligatoire.";
    }
    if (!password) {
      return "Le mot de passe est obligatoire.";
    }
    if (password.length < 8) {
      return "Le mot de passe doit contenir au moins 8 caracteres.";
    }
    return "";
  };

  const validatePerformerStep = (stepValue: number) => {
    if (stepValue === 1) {
      return validateAccountStep();
    }
    if (stepValue === 2) {
      if (!specialty || !gender || !city || languages.length === 0 || !phone) {
        return "Specialite, genre, ville, langues et telephone sont obligatoires.";
      }
      return "";
    }
    if (stepValue === 3) {
      if (
        !heightCm ||
        !weightKg ||
        !neckCircumferenceCm ||
        !pantLengthCm ||
        !headCircumferenceCm ||
        !chestCircumferenceCm ||
        !shoeSize
      ) {
        return "Toutes les mensurations sont obligatoires.";
      }
      return "";
    }
    if (stepValue === 4 && !profilePhoto) {
      return "La photo de profil est obligatoire.";
    }
    return "";
  };

  const validateCurrentStep = () =>
    role === "performer" ? validatePerformerStep(formStep) : validateAccountStep();

  const validateFullPerformerForm = () => {
    for (let currentStep = 1; currentStep <= PERFORMER_FORM_STEPS.length; currentStep += 1) {
      const message = validatePerformerStep(currentStep);
      if (message) {
        return message;
      }
    }
    return "";
  };

  const handleNextStep = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setFormStep((prev) => Math.min(prev + 1, totalFormSteps));
  };

  const handlePreviousStep = () => {
    setError("");
    setFormStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const accountError = validateAccountStep();
    if (accountError) {
      setError(accountError);
      return;
    }

    if (role === "performer") {
      const performerError = validateFullPerformerForm();
      if (performerError) {
        setError(performerError);
        return;
      }
    }

    if (!isLastFormStep) {
      handleNextStep();
      return;
    }

    setLoading(true);
    setPerformerSetupInProgress(role === "performer");
    try {
      await register(email.trim(), password, role);
      if (role === "performer") {
        await request("/performers/me", {
          method: "PATCH",
          body: {
            specialty,
            gender,
            city,
            languages,
            phone,
            height_cm: heightCm,
            weight_kg: weightKg,
            neck_circumference_cm: neckCircumferenceCm,
            pant_length_cm: pantLengthCm,
            head_circumference_cm: headCircumferenceCm,
            chest_circumference_cm: chestCircumferenceCm,
            shoe_size: shoeSize,
          },
        });

        if (profilePhoto) {
          const body = new FormData();
          body.append("photo", profilePhoto);
          await request("/uploads/performer-photo", {
            method: "POST",
            body,
          });
        }

        if (galleryPhotos.length > 0) {
          const body = new FormData();
          for (const photo of galleryPhotos) {
            body.append("photos", photo);
          }
          await request("/uploads/performer-gallery", {
            method: "POST",
            body,
          });
        }
      }
      navigate(role === "recruiter" ? "/recruiter/dashboard" : "/performer/profile");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setPerformerSetupInProgress(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-5 py-16 animate-page-enter">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="w-10 h-10 border border-gold-600 flex items-center justify-center">
              <span className="text-gold-400 font-display font-bold">C</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold text-cream-100">Creer votre compte</h1>
          <p className="text-cream-500 mt-3 text-sm">
            {step === 1
              ? "Choisissez votre profil pour commencer"
              : `Inscription en tant que ${role === "performer" ? "performeur" : "recruteur"}`}
          </p>
        </div>

        {/* Step 1: Role selection */}
        {step === 1 && (
          <div className="grid sm:grid-cols-2 gap-5 stagger-children">
            <RoleCard
              title="Performeur"
              description="Je suis artiste, acteur, figurant ou technicien et je cherche des opportunites de casting."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              }
              color="gold"
              onClick={() => selectRole("performer")}
            />
            <RoleCard
              title="Recruteur"
              description="Je suis producteur, realisateur ou directeur de casting et je cherche des talents."
              icon={
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              }
              color="cream"
              onClick={() => selectRole("recruiter")}
            />
          </div>
        )}

        {/* Step 2: Registration form */}
        {step === 2 && (
          <Card className="p-7 sm:p-9">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-cream-500 mb-3">
                  Etape {formStep} / {totalFormSteps}
                </p>
                <div className="flex flex-wrap gap-2">
                  {formStepLabels.map((label, index) => {
                    const itemStep = index + 1;
                    const active = itemStep === formStep;
                    const completed = itemStep < formStep;
                    return (
                      <div
                        key={label}
                        className={`flex items-center gap-2 px-3 py-2 border rounded-sm text-xs uppercase tracking-widest ${
                          active
                            ? "border-gold-500 text-gold-400 bg-gold-500/10"
                            : completed
                              ? "border-jade-600/50 text-jade-500 bg-jade-600/10"
                              : "border-noir-600 text-cream-500 bg-noir-800"
                        }`}
                      >
                        <span
                          className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] ${
                            active
                              ? "bg-gold-500 text-noir-950"
                              : completed
                                ? "bg-jade-600 text-noir-950"
                                : "bg-noir-700 text-cream-400"
                          }`}
                        >
                          {itemStep}
                        </span>
                        <span>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-wine-700/20 border border-wine-700/30 text-wine-400 text-sm">
                  {error}
                </div>
              )}

              {formStep === 1 && (
                <>
                  <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    required
                  />

                  <Input
                    label="Mot de passe"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caracteres"
                    minLength={8}
                    required
                  />
                </>
              )}

              {role === "performer" && formStep === 2 && (
                <>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Select
                      label="Specialite"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      required
                    >
                      <option value="">Choisir...</option>
                      {SPECIALTY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    <Select
                      label="Genre"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                    >
                      <option value="">Choisir...</option>
                      {GENDER_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                    <Select
                      label="Ville"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                    >
                      <option value="">Choisir...</option>
                      {CITY_OPTIONS.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <span className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">
                      Langues
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {LANGUAGE_OPTIONS.map((option) => {
                        const checked = languages.includes(option);
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0600752594"
                    required
                  />
                </>
              )}

              {role === "performer" && formStep === 3 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  <Input
                    label="Taille (cm)"
                    type="number"
                    min={1}
                    value={heightCm}
                    onChange={(e) => setHeightCm(e.target.value)}
                    placeholder="178"
                    required
                  />
                  <Input
                    label="Poids (kg)"
                    type="number"
                    min={1}
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="70"
                    required
                  />
                  <Input
                    label="Tour de cou (cm)"
                    type="number"
                    min={1}
                    value={neckCircumferenceCm}
                    onChange={(e) => setNeckCircumferenceCm(e.target.value)}
                    placeholder="38"
                    required
                  />
                  <Input
                    label="Longueur pantalon (cm)"
                    type="number"
                    min={1}
                    value={pantLengthCm}
                    onChange={(e) => setPantLengthCm(e.target.value)}
                    placeholder="94"
                    required
                  />
                  <Input
                    label="Tour de tete (cm)"
                    type="number"
                    min={1}
                    value={headCircumferenceCm}
                    onChange={(e) => setHeadCircumferenceCm(e.target.value)}
                    placeholder="59"
                    required
                  />
                  <Input
                    label="Tour de poitrine (cm)"
                    type="number"
                    min={1}
                    value={chestCircumferenceCm}
                    onChange={(e) => setChestCircumferenceCm(e.target.value)}
                    placeholder="88"
                    required
                  />
                  <Input
                    label="Pointure chaussures"
                    type="number"
                    min={1}
                    value={shoeSize}
                    onChange={(e) => setShoeSize(e.target.value)}
                    placeholder="42"
                    required
                  />
                </div>
              )}

              {role === "performer" && formStep === 4 && (
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <Input
                      label="Photo de profil"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      onChange={handleProfilePhotoChange}
                      required
                    />
                    <p className="text-xs text-cream-500 mt-2">Formats: JPG, PNG, WEBP, GIF (max 5 MB).</p>
                    {profilePhoto && (
                      <p className="text-xs text-gold-500 mt-2">
                        Selectionnee: {profilePhoto.name}
                      </p>
                    )}
                    {profilePreviewUrl && (
                      <div className="mt-3">
                        <p className="text-xs text-cream-500 mb-2 uppercase tracking-widest">Apercu profil</p>
                        <img
                          src={profilePreviewUrl}
                          alt="Apercu photo de profil"
                          className="h-32 w-32 rounded-sm object-cover border border-noir-600"
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <Input
                      label="Galerie (photos)"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/gif"
                      multiple
                      onChange={handleGalleryPhotosChange}
                    />
                    <p className="text-xs text-cream-500 mt-2">Optionnel, 12 photos max (20 au total dans la galerie).</p>
                    {galleryPhotos.length > 0 && (
                      <>
                        <p className="text-xs text-gold-500 mt-2">
                          {galleryPhotos.length} fichier(s) selectionne(s).
                        </p>
                          <div className="mt-3">
                            <p className="text-xs text-cream-500 mb-2 uppercase tracking-widest">Apercu galerie</p>
                            <div className="grid grid-cols-4 gap-2">
                              {visibleGalleryPreviewUrls.map((url, index) => {
                                const isOverlayTile =
                                  hiddenGalleryImagesCount > 0 &&
                                  index === visibleGalleryPreviewUrls.length - 1;

                                if (isOverlayTile) {
                                  return (
                                    <button
                                      key={`${url}-${index + 1}`}
                                      type="button"
                                      className="relative h-20 w-full rounded-sm overflow-hidden border border-noir-600 cursor-pointer"
                                      onClick={() => setGalleryModalOpen(true)}
                                    >
                                      <img
                                        src={url}
                                        alt={`Apercu galerie ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                      <span className="absolute inset-0 flex items-center justify-center bg-noir-950/70 text-cream-100 text-lg font-semibold">
                                        +{hiddenGalleryImagesCount}
                                      </span>
                                    </button>
                                  );
                                }

                                return (
                                  <img
                                    key={`${url}-${index + 1}`}
                                    src={url}
                                    alt={`Apercu galerie ${index + 1}`}
                                    className="h-20 w-full rounded-sm object-cover border border-noir-600"
                                  />
                                );
                              })}
                            </div>
                            {hiddenGalleryImagesCount > 0 && (
                              <p className="text-xs text-cream-500 mt-2">
                                Cliquez sur +{hiddenGalleryImagesCount} pour voir toute la galerie.
                              </p>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                </div>
              )}

              <div className="pt-2 flex gap-3">
                {role === "performer" && formStep > 1 && (
                  <Button type="button" variant="outline" size="lg" onClick={handlePreviousStep}>
                    Precedent
                  </Button>
                )}

                {role === "performer" && !isLastFormStep ? (
                  <Button type="button" className="flex-1" size="lg" onClick={handleNextStep}>
                    Suivant
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1" size="lg" disabled={loading}>
                    {loading ? "Creation..." : "Creer mon compte"}
                  </Button>
                )}
              </div>

              {!preselectedRole && (
                <button
                  type="button"
                  className="w-full text-center text-sm text-cream-500 hover:text-gold-400 transition-colors"
                  onClick={() => {
                    setStep(1);
                    setFormStep(1);
                    setError("");
                  }}
                >
                  &larr; Changer de profil
                </button>
              )}
            </form>
          </Card>
        )}

        <p className="text-center mt-8 text-sm text-cream-500">
          Deja inscrit ?{" "}
          <Link to="/login" className="text-gold-500 font-medium hover:text-gold-400 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>

      {galleryModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-noir-950/80 backdrop-blur-sm flex items-center justify-center p-5"
          onClick={() => setGalleryModalOpen(false)}
        >
          <div
            className="w-full max-w-4xl max-h-[85vh] overflow-auto bg-noir-900 border border-noir-700 p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-cream-100 font-display text-xl">
                Galerie complete ({recentGalleryPreviewUrls.length})
              </h3>
              <Button type="button" variant="outline" size="sm" onClick={() => setGalleryModalOpen(false)}>
                Fermer
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {recentGalleryPreviewUrls.map((url, index) => (
                <img
                  key={`modal-${url}-${index + 1}`}
                  src={url}
                  alt={`Galerie ${index + 1}`}
                  className="h-36 w-full rounded-sm object-cover border border-noir-600"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RoleCard({
  title,
  description,
  icon,
  color,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: "gold" | "cream";
  onClick: () => void;
}) {
  const borderHover = color === "gold" ? "hover:border-gold-600/60" : "hover:border-cream-400/30";
  const iconColor = color === "gold" ? "text-gold-500 border-gold-700/40" : "text-cream-300 border-cream-400/20";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left p-6 bg-noir-800/60 border border-noir-700 ${borderHover} hover:bg-noir-800 transition-all duration-300 cursor-pointer group`}
    >
      <div className={`w-14 h-14 border ${iconColor} flex items-center justify-center mb-5 group-hover:bg-noir-700/50 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="font-display font-semibold text-lg text-cream-100 mb-2">{title}</h3>
      <p className="text-sm text-cream-500 leading-relaxed">{description}</p>
    </button>
  );
}
