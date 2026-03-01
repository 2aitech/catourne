import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { GlassButton } from "../components/ui/glass-button";
import { TalentProfileCard } from "../components/ui/talent-profile-card";
import {
  Search, Users, Video, UserPlus, ListChecks, MessageSquare,
  Film, CalendarDays, Contact, Tv, Clapperboard, Megaphone,
  Music, BookOpen, FileVideo, Radio, MonitorPlay, CheckCircle2,
} from "lucide-react";

/* ── Data ─────────────────────────────────────────────────────── */

const STATS = [
  { value: "GRATUIT", label: "Pour créer un compte recruteur" },
  { value: "+500",    label: "Talents inscrits" },
  { value: "+200",    label: "Castings lancés" },
  { value: "+50",     label: "Agences partenaires" },
];

const FLOATING_AVATARS = [
  { src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=200&auto=format&fit=crop", style: "top-[10%] left-[8%] w-16 h-16" },
  { src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop", style: "top-[6%] left-[22%] w-20 h-20" },
  { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop", style: "top-[35%] left-[4%] w-20 h-20" },
  { src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop", style: "top-[62%] left-[10%] w-16 h-16" },
  { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop", style: "top-[10%] right-[18%] w-20 h-20" },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop", style: "top-[5%] right-[5%] w-16 h-16" },
  { src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=200&auto=format&fit=crop", style: "top-[42%] right-[4%] w-20 h-20" },
  { src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop", style: "top-[65%] right-[12%] w-16 h-16" },
];

const PARTNERS = [
  "Netflix Maroc", "Canal+ Afrique", "2M / SOREAD", "SNRT", "OCP Média", "Ali n' Productions",
];

const FEATURE_CARDS = [
  {
    title: "Trouvez de grands talents",
    desc: "Accédez au réseau de talents créatifs le plus diversifié du Maroc.",
  },
  {
    title: "Recrutement fluide",
    desc: "Des outils flexibles pour publier vos offres, suivre les candidatures et recruter.",
  },
  {
    title: "Paiements sécurisés",
    desc: "Trouvez, recrutez et payez vos talents en un seul endroit en toute sécurité.",
  },
];

const TOOLS = [
  { icon: <Search className="w-5 h-5" />,      title: "Filtres de recherche",     desc: "Ciblez les talents avec précision" },
  { icon: <Users className="w-5 h-5" />,        title: "Collaboration d'équipe",   desc: "Travaillez ensemble pour trouver le parfait match" },
  { icon: <Video className="w-5 h-5" />,        title: "Auditions virtuelles",     desc: "Organisez des auditions adaptées à votre secteur" },
  { icon: <UserPlus className="w-5 h-5" />,     title: "Inviter des talents",      desc: "Invitez vos favoris à postuler" },
  { icon: <ListChecks className="w-5 h-5" />,   title: "Gestion de shortlist",     desc: "Compilez et partagez vos sélections de candidats" },
  { icon: <MessageSquare className="w-5 h-5" />,title: "Messagerie directe",       desc: "Engagez personnellement chaque talent" },
  { icon: <Film className="w-5 h-5" />,         title: "Auto-bandes",              desc: "Évaluez les talents avec facilité" },
  { icon: <CalendarDays className="w-5 h-5" />, title: "Planning d'auditions",     desc: "Coordonnez les rendez-vous talents" },
  { icon: <Contact className="w-5 h-5" />,      title: "Profils complets",         desc: "Explorez des profils de talents détaillés" },
];

const TALENT_CATEGORIES = ["Acteurs", "Voix-off", "Équipe production", "Mannequins", "Explorer tous"];

const TALENTS = [
  { name: "Amina El Idrissi",  meta: "Actrice · Casablanca",   score: 96, src: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop" },
  { name: "Youssef Benali",    meta: "Mannequin · Marrakech",  score: 91, src: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop" },
  { name: "Fatima Zahra Ouali",meta: "Danseuse · Rabat",       score: 88, src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop" },
  { name: "Karim Tazi",        meta: "Voix-off · Fès",         score: 84, src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop" },
  { name: "Nora Benmoussa",    meta: "Figurante · Ouarzazate", score: 79, src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=400&auto=format&fit=crop" },
  { name: "Omar Fassi",        meta: "Cascadeur · Agadir",     score: 82, src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop" },
  { name: "Leila Chraibi",     meta: "Modèle · Tanger",        score: 93, src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop" },
  { name: "Hassan Moukrim",    meta: "Acteur · Meknès",        score: 87, src: "https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop" },
  { name: "Sara El Amrani",    meta: "Actrice · Casablanca",   score: 90, src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop" },
  { name: "Mehdi Alaoui",      meta: "Réalisateur · Rabat",    score: 85, src: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=400&auto=format&fit=crop" },
];

const PROJECT_CATEGORIES = ["Film + TV", "Production voix-off", "Théâtre", "Publicités", "Contenu digital"];

const PROJECT_TYPES = [
  { icon: <Tv className="w-5 h-5" />,          label: "Séries TV" },
  { icon: <Clapperboard className="w-5 h-5" />, label: "Longs métrages" },
  { icon: <Megaphone className="w-5 h-5" />,    label: "Publicités" },
  { icon: <Music className="w-5 h-5" />,        label: "Clips musicaux" },
  { icon: <Film className="w-5 h-5" />,         label: "Courts métrages" },
  { icon: <BookOpen className="w-5 h-5" />,     label: "Documentaires" },
  { icon: <Radio className="w-5 h-5" />,        label: "Promotions en ligne" },
  { icon: <MonitorPlay className="w-5 h-5" />,  label: "Multimédia" },
];

const SUCCESS_STORY = {
  quote: "«&nbsp;Nous cherchions des acteurs marocains authentiques, capables d'incarner des personnages forts. Grâce à CATOURNE, nous avons trouvé exactement ce qu'il nous fallait en quelques jours seulement.&nbsp;»",
  author: "Khalid Amrani",
  role: "Réalisateur / Producteur",
  avatar: "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?q=80&w=200&auto=format&fit=crop",
  title: "Production marocaine primée grâce au casting CATOURNE",
  image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=900",
  points: [
    "La production avait besoin de talents de haute qualité dans un budget serré.",
    "Ils voulaient des professionnels motivés et en adéquation avec le projet.",
    "Six acteurs parfaitement adaptés ont été castés via CATOURNE.",
    "Le film a remporté plusieurs prix dans des festivals nationaux.",
  ],
};

/* ── Component ────────────────────────────────────────────────── */

export function RecruteursPage() {
  const { user } = useAuth();
  const [activeTalentCat, setActiveTalentCat] = useState("Acteurs");
  const [activeProjectCat, setActiveProjectCat] = useState("Film + TV");

  const ctaHref = user ? "/recruiter/offers/new" : "/register?role=recruiter";

  return (
    <div className="bg-noir-950 text-cream-100 overflow-x-hidden">

      {/* ── 1. HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-[100dvh] flex items-center overflow-hidden -mt-[68px] pt-[68px]">

        {/* Cinematic background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1800')" }}
        />
        {/* Layered overlays */}
        <div className="absolute inset-0 bg-noir-950/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-noir-950/95 via-noir-950/60 to-noir-950/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_70%_at_25%_50%,rgba(194,142,76,0.12),transparent)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-noir-950 via-transparent to-transparent" />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)",
            backgroundSize: "64px 64px",
          }}
        />
        {/* Gold top line */}
        <div className="absolute inset-x-0 top-[68px] h-px bg-gradient-to-r from-transparent via-gold-500/30 to-transparent" />

        <div className="relative z-10 w-full max-w-[90rem] mx-auto px-6 sm:px-8 lg:px-12 py-20 flex flex-col">

          {/* Toggle — centered above grid */}
          <div className="flex justify-center mb-12">
            <div className="inline-flex rounded-full border border-white/10 bg-noir-950/50 p-1 backdrop-blur-md">
              <Link
                to="/"
                className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-cream-400 hover:text-cream-100 transition-colors"
              >
                Je suis talent
              </Link>
              <span className="rounded-full px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] bg-gold-500 text-noir-950 shadow-lg shadow-gold-500/30">
                Je suis recruteur
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 xl:gap-24 items-center flex-1">

            {/* ── Left: text content ── */}
            <div className="flex flex-col justify-center">

              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-6">
                <span className="h-px w-10 bg-gold-500" />
                <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-gold-400">
                  Plateforme de casting · Maroc
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-serif font-bold leading-[0.88] tracking-tight text-cream-50 mb-8"
                style={{ fontSize: "clamp(2.8rem, 5vw, 6.5rem)" }}>
                Trouvez votre<br />
                prochain<br />
                <span className="text-gradient-gold italic">membre d'équipe</span>
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-cream-400 leading-relaxed mb-10 max-w-lg">
                Connectez-vous avec les meilleurs talents créatifs du Maroc. Acteurs, mannequins, équipes techniques — tout en un seul endroit.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 mb-14">
                <Link to={ctaHref}>
                  <GlassButton size="lg" contentClassName="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-widest">
                    <Clapperboard className="w-4 h-4 shrink-0" />
                    Publier un casting
                  </GlassButton>
                </Link>
                <Link
                  to="/talents"
                  className="group flex items-center gap-2 text-sm font-semibold text-cream-300 hover:text-gold-400 transition-colors duration-200"
                >
                  Explorer les talents
                  <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                </Link>
              </div>

              {/* Stats bar */}
              <div className="flex flex-wrap gap-x-8 gap-y-5 pt-8 border-t border-white/10">
                {STATS.map((s, i) => (
                  <div key={s.label} className="flex items-center gap-4">
                    {i > 0 && <div className="w-px h-8 bg-white/10 hidden sm:block" />}
                    <div>
                      <p className="font-serif text-2xl font-bold text-gold-400 leading-none">{s.value}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream-500 leading-tight">{s.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: floating talent portrait cards ── */}
            <div className="relative hidden lg:flex items-center justify-center h-[680px] xl:h-[780px]">

              {/* Decorative ring */}
              <div className="absolute inset-[10%] rounded-full border border-gold-500/8 pointer-events-none" />
              <div className="absolute inset-[25%] rounded-full border border-gold-500/5 pointer-events-none" />

              {/* Card 1 — top left */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=400&auto=format&fit=crop"
                name="Amina El Idrissi" role="Actrice" city="Casablanca"
                className="absolute top-[4%] left-[5%] w-36 h-48"
                delay={0}
              />
              {/* Card 2 — top right, larger */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop"
                name="Youssef Benali" role="Mannequin" city="Marrakech"
                className="absolute top-[2%] right-[8%] w-44 h-56"
                delay={0.6}
              />
              {/* Card 3 — middle left */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
                name="Fatima Zahra" role="Danseuse" city="Rabat"
                className="absolute top-[35%] left-[0%] w-40 h-52"
                delay={1.2}
              />
              {/* Card 4 — center, tall */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop"
                name="Karim Tazi" role="Voix-off" city="Fès"
                className="absolute top-[20%] left-[32%] w-44 h-60"
                delay={0.3}
              />
              {/* Card 5 — middle right */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=400&auto=format&fit=crop"
                name="Hassan Moukrim" role="Acteur" city="Meknès"
                className="absolute top-[30%] right-[2%] w-40 h-52"
                delay={0.9}
              />
              {/* Card 6 — bottom left */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop"
                name="Leila Chraibi" role="Modèle" city="Tanger"
                className="absolute bottom-[4%] left-[10%] w-36 h-48"
                delay={1.5}
              />
              {/* Card 7 — bottom right */}
              <HeroTalentCard
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop"
                name="Sara El Amrani" role="Actrice" city="Casablanca"
                className="absolute bottom-[2%] right-[12%] w-40 h-52"
                delay={0.5}
              />

              {/* Live badge */}
              <div className="absolute top-[48%] right-[28%] flex items-center gap-2 bg-noir-900/80 backdrop-blur-md border border-gold-500/30 rounded-full px-4 py-2 shadow-xl">
                <span className="w-2 h-2 rounded-full bg-gold-500 animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold-400">+500 talents actifs</span>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-500">
          <span className="text-[10px] uppercase tracking-widest font-bold">Défiler</span>
          <div className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent"
            style={{ animation: "scrollDown 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ── 2. PARTNERS ───────────────────────────────────────── */}
      <section className="py-14 border-t border-b border-white/6 bg-noir-900/60">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-cream-500 text-sm font-medium mb-8 tracking-wide">
            Approuvé par les créateurs et directeurs de casting au Maroc
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {PARTNERS.map((p) => (
              <div
                key={p}
                className="px-7 py-4 rounded-2xl bg-noir-800/80 border border-white/8 text-cream-300 font-bold text-sm tracking-wide hover:border-gold-500/30 hover:text-gold-400 transition-all duration-200"
              >
                {p}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. WHY CATOURNE ───────────────────────────────────── */}
      <section className="py-28 bg-noir-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(194,142,76,0.07),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-cream-500 text-sm mb-3 font-medium tracking-wide">
              Des petits projets aux longs métrages
            </p>
            <h2 className="font-serif font-bold text-cream-50 text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Pourquoi <span className="text-gradient-gold">+500</span> professionnels<br className="hidden sm:block" /> font confiance à CATOURNE
            </h2>
          </div>

          {/* 3 feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-16">
            {FEATURE_CARDS.map((f) => (
              <div key={f.title} className="rounded-2xl border border-white/10 bg-noir-800/60 p-7 hover:border-gold-500/30 transition-colors duration-200">
                <h3 className="font-serif text-lg font-bold text-cream-100 mb-2">{f.title}</h3>
                <p className="text-sm text-cream-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Tools grid */}
          <div className="text-center mb-10">
            <p className="text-cream-100 font-semibold text-base tracking-wide">
              Des outils de recrutement de pointe pour vos besoins
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-7 mb-14">
            {TOOLS.map((tool) => (
              <div key={tool.title} className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  {tool.icon}
                </div>
                <div>
                  <p className="font-semibold text-cream-100 text-sm">{tool.title}</p>
                  <p className="text-cream-500 text-xs mt-0.5 leading-relaxed">{tool.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to={ctaHref}>
              <GlassButton size="lg" contentClassName="text-[10px] font-bold uppercase tracking-widest min-w-[200px] justify-center flex">
                Publier un casting
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. TALENT GRID ────────────────────────────────────── */}
      <section className="py-28 bg-noir-900 relative border-t border-white/6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_80%_50%,rgba(194,142,76,0.06),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-cream-500 text-sm mb-3 font-medium tracking-wide">
              Trouvez le parfait pour vos rôles
            </p>
            <h2 className="font-serif font-bold text-cream-50 text-4xl sm:text-5xl lg:text-6xl leading-tight">
              Accédez à <span className="text-gradient-gold">+500</span> talents créatifs
            </h2>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {TALENT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTalentCat(cat)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  activeTalentCat === cat
                    ? "bg-gold-500 border-gold-500 text-noir-950"
                    : "bg-transparent border-white/15 text-cream-400 hover:border-gold-500/40 hover:text-cream-100"
                }`}
              >
                {activeTalentCat === cat && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                {cat}
              </button>
            ))}
          </div>

          {/* Profile card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-5 gap-y-8">
            {TALENTS.slice(0, 9).map((t) => (
              <TalentProfileCard key={t.name} {...t} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/talents">
              <GlassButton size="lg" contentClassName="text-[10px] font-bold uppercase tracking-widest min-w-[200px] justify-center flex">
                Découvrir les talents
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. PROJECT TYPES ──────────────────────────────────── */}
      <section className="py-28 bg-noir-950 border-t border-white/6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_20%_50%,rgba(194,142,76,0.06),transparent)] pointer-events-none" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-cream-500 text-sm mb-3 font-medium tracking-wide">
              Donnez vie à vos projets créatifs
            </p>
            <h2 className="font-serif font-bold text-cream-50 text-4xl sm:text-5xl lg:text-6xl leading-tight">
              <span className="text-gradient-gold">+200</span> projets lancés ici
            </h2>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveProjectCat(cat)}
                className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                  activeProjectCat === cat
                    ? "bg-gold-500 border-gold-500 text-noir-950"
                    : "bg-transparent border-white/15 text-cream-400 hover:border-gold-500/40 hover:text-cream-100"
                }`}
              >
                {activeProjectCat === cat && <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />}
                {cat}
              </button>
            ))}
          </div>

          {/* Hero image */}
          <div className="relative rounded-3xl overflow-hidden mb-10 border border-white/10" style={{ height: "clamp(180px, 35vw, 320px)" }}>
            <img
              src="https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1400"
              alt="Film production"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-noir-950/80 via-noir-950/30 to-transparent" />
            {/* Play icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-cream-100/90 flex items-center justify-center shadow-xl">
                <Clapperboard className="w-6 h-6 text-noir-950" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <h3 className="font-serif text-2xl font-bold text-cream-50 mb-1">Film, Vidéo &amp; Production TV</h3>
              <p className="text-cream-400 text-sm">Pour les réalisateurs / Directeurs de casting / Agences créatives</p>
            </div>
          </div>

          {/* Project type icons grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-10 gap-y-6 mb-14">
            {PROJECT_TYPES.map((pt) => (
              <div key={pt.label} className="flex items-center gap-3">
                <div className="shrink-0 w-9 h-9 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400">
                  {pt.icon}
                </div>
                <span className="text-cream-300 text-sm font-medium">{pt.label}</span>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to={ctaHref}>
              <GlassButton size="lg" contentClassName="text-[10px] font-bold uppercase tracking-widest min-w-[200px] justify-center flex">
                Publier un casting
              </GlassButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. SUCCESS STORY ──────────────────────────────────── */}
      <section className="py-28 bg-noir-900 border-t border-white/6 relative">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <p className="text-cream-500 text-sm mb-3 font-medium tracking-wide">Histoires de succès</p>
            <h2 className="font-serif font-bold text-cream-50 text-4xl sm:text-5xl leading-tight">
              Vrais projets. <span className="text-gradient-gold italic">Vrais résultats.</span>
            </h2>
          </div>

          <p className="font-serif font-semibold text-cream-100 text-lg mb-6">
            {SUCCESS_STORY.title}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Quote card */}
            <div className="rounded-3xl border border-white/10 bg-noir-800/60 p-8 flex flex-col justify-between">
              <div>
                <div className="inline-flex px-3 py-1 rounded bg-gold-500/10 border border-gold-500/20 mb-6">
                  <span className="font-display text-xs font-bold tracking-widest text-gold-400">CATOURNE</span>
                </div>
                <p
                  className="font-serif text-cream-300 text-base leading-relaxed mb-8 italic"
                  dangerouslySetInnerHTML={{ __html: SUCCESS_STORY.quote }}
                />
              </div>
              <div className="flex items-center gap-3 border-t border-white/8 pt-6">
                <img
                  src={SUCCESS_STORY.avatar}
                  alt={SUCCESS_STORY.author}
                  className="w-10 h-10 rounded-full object-cover border border-gold-500/30"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <p className="font-semibold text-cream-100 text-sm">{SUCCESS_STORY.author}</p>
                  <p className="text-cream-500 text-xs">{SUCCESS_STORY.role}</p>
                </div>
              </div>
            </div>

            {/* Case study card */}
            <div className="rounded-3xl border border-white/10 bg-noir-800/60 p-8 flex flex-col gap-5">
              <img
                src={SUCCESS_STORY.image}
                alt="Tournage"
                className="w-full rounded-2xl object-cover h-40 sm:h-[200px]"
                referrerPolicy="no-referrer"
              />
              <p className="text-xs text-cream-600">Source photo : Plateau de tournage, Ouarzazate</p>
              <h4 className="font-serif font-bold text-cream-100 text-base leading-snug">
                La production a utilisé CATOURNE pour caster le rôle principal et cinq seconds rôles dans un film primé
              </h4>
              <ul className="space-y-2.5 flex-1">
                {SUCCESS_STORY.points.map((pt) => (
                  <li key={pt} className="flex items-start gap-2.5 text-sm text-cream-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-gold-500 mt-0.5" />
                    {pt}
                  </li>
                ))}
              </ul>
              <Link to={ctaHref}>
                <GlassButton size="default" className="w-full" contentClassName="w-full justify-center flex text-[10px] font-bold uppercase tracking-widest">
                  Lire l'étude de cas
                </GlassButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FINAL CTA BANNER ───────────────────────────────── */}
      <section className="py-20 bg-noir-950 border-t border-white/6">
        <div className="max-w-5xl mx-auto px-6">
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-12 text-center">
            {/* Gold gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-gold-700 via-gold-500 to-gold-600" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_20%_50%,rgba(255,255,255,0.10),transparent)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_80%_50%,rgba(28,28,28,0.15),transparent)]" />

            <div className="relative z-10">
              <p className="text-noir-950/70 text-sm font-semibold mb-3 tracking-wide">
                Publiez un casting et connectez-vous avec les meilleurs talents aujourd'hui.
              </p>
              <h2 className="font-serif font-bold text-noir-950 text-4xl sm:text-5xl lg:text-6xl leading-tight mb-8">
                Créez quelque chose de grand.
              </h2>
              <Link to={ctaHref}>
                <button className="px-10 py-4 rounded-full bg-noir-950 text-cream-100 text-sm font-bold uppercase tracking-widest hover:bg-noir-800 transition-colors duration-200 shadow-xl">
                  Commencer
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── HeroTalentCard sub-component ────────────────────────────── */
function HeroTalentCard({
  src, name, role, city, className, delay,
}: { src: string; name: string; role: string; city: string; className: string; delay: number }) {
  return (
    <div
      className={`absolute rounded-2xl overflow-hidden border border-white/15 shadow-2xl group ${className}`}
      style={{ animation: `float ${3.5 + (delay % 2)}s ease-in-out ${delay}s infinite alternate` }}
    >
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/90 via-noir-950/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3 backdrop-blur-[2px]">
        <p className="font-serif font-bold text-cream-50 text-xs leading-tight truncate">{name}</p>
        <p className="text-gold-400 text-[10px] font-semibold mt-0.5">{role} · {city}</p>
      </div>
    </div>
  );
}

