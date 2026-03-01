import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../lib/auth-context";
import { useLang } from "../lib/lang-context";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Badge, PageContainer } from "../components/ui";
import { GlassButton } from "../components/ui/glass-button";
import { CardStack } from "../components/ui/card-stack";
import { FocusRail, type FocusRailItem } from "../components/ui/focus-rail";
import heroBackground from "../assets/ait-benhaddou-moroccan-ancient-fortress-2026-01-07-06-29-51-utc.jpg";

export function HomePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const h = t.home;
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [activeWhyTab, setActiveWhyTab] = useState("cinema");
  const [expandedWhyStep, setExpandedWhyStep] = useState<string | null>("step-1");

  useEffect(() => {
    request<{ offers: Offer[] }>("/offers")
      .then((data) => setRecentOffers((data.offers ?? []).slice(0, 6)))
      .catch(() => {});
  }, []);

  const categories = [
    { key: "all", label: h.filtersCategoryAll },
    { key: "actor", label: h.filtersCategoryActor },
    { key: "extra", label: h.filtersCategoryExtra },
    { key: "tech", label: h.filtersCategoryTech },
    { key: "model", label: h.filtersCategoryModel },
    { key: "voice", label: h.filtersCategoryVoice },
  ];
  const whyCatourneTabs = [
    {
      value: "cinema",
      label: "Cinéma",
      src: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=1000",
      alt: "Cinéma",
    },
    {
      value: "pub",
      label: "Publicité",
      src: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=1000",
      alt: "Publicité",
    },
    {
      value: "mode",
      label: "Mode",
      src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&q=80&w=1000",
      alt: "Mode",
    },
  ];
  const whyCatourneSteps = [
    {
      id: "step-1",
      title: "Réseau Premium",
      text: "Accédez à des directeurs de casting et des producteurs vérifiés. Fini les intermédiaires douteux.",
    },
    {
      id: "step-2",
      title: "Matching Intelligent",
      text: "Notre IA analyse votre profil et vous propose uniquement les rôles qui vous correspondent vraiment.",
    },
    {
      id: "step-3",
      title: "Visibilité Maximale",
      text: "Votre portfolio est optimisé pour être mis en avant auprès des décideurs du secteur au bon moment.",
    },
  ];
  const heroGuestHref = "/register?role=performer";
  const heroGuestLabel = h.heroJoinNow;

  const [activePerformerIdx, setActivePerformerIdx] = useState(0);
  const performers: FocusRailItem[] = [
    {
      id: 1,
      title: "Amina El Idrissi",
      description: "Actrice primée, spécialisée dans le cinéma d'auteur et les drames historiques.",
      meta: "Actrice • Cinéma",
      imageSrc: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 2,
      title: "Youssef Benali",
      description: "Mannequin international avec plus de 10 ans d'expérience en mode et publicité.",
      meta: "Mannequin • Mode",
      imageSrc: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 3,
      title: "Fatima Zahra Ouali",
      description: "Danseuse contemporaine et chorégraphe, fusionnant tradition et modernité.",
      meta: "Danseuse • Scène",
      imageSrc: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 4,
      title: "Karim Tazi",
      description: "Acteur de doublage et voix-off pour documentaires et publicités nationales.",
      meta: "Voix-off • Audio",
      imageSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 5,
      title: "Nora Benmoussa",
      description: "Figurante et actrice de second rôle, vue dans plus de 30 productions marocaines.",
      meta: "Figurante • Cinéma",
      imageSrc: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 6,
      title: "Omar Fassi",
      description: "Cascadeur professionnel spécialisé dans les scènes d'action et les films d'aventure.",
      meta: "Cascadeur • Action",
      imageSrc: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
    {
      id: 7,
      title: "Leila Chraibi",
      description: "Modèle photo et influenceuse, ambassadrice de marques marocaines et internationales.",
      meta: "Modèle • Mode",
      imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop",
      href: "/talents",
    },
  ];

  return (
    <div className="bg-noir-950 text-cream-100">

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[100dvh] items-center overflow-hidden -mt-[68px] pt-[68px]">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroBackground}')` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,142,76,0.15),transparent_55%)]" />

        <PageContainer className="relative z-10 w-full py-20 sm:py-24 xl:py-32">
          <div className="mx-auto max-w-7xl text-center">

            {!user && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-full border border-white/10 bg-noir-950/30 p-1 backdrop-blur-sm">
                  <span className="rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] bg-gold-500 text-noir-950 sm:px-6">
                    {h.heroBtnTalent}
                  </span>
                  <Link
                    to="/recruteurs"
                    className="rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] text-cream-300 hover:text-cream-100 transition-colors sm:px-6"
                  >
                    {h.heroBtnRecruiter}
                  </Link>
                </div>
              </div>
            )}

            {/* Eyebrow */}
            <div className="mb-8 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold-500" />
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-gold-400">
                {h.heroLabel}
              </p>
              <span className="h-px w-10 bg-gold-500" />
            </div>

            {/* Heading */}
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-6xl lg:text-7xl xl:text-8xl sm:whitespace-nowrap">
              Le talent rencontre <span className="text-gradient-gold italic">l'opportunite</span>
            </h1>

            <p className="mx-auto mt-8 text-base leading-relaxed text-cream-400 sm:text-xl xl:text-2xl">
              {h.heroDesc}
            </p>

            {/* CTA Buttons */}
            <div className="mt-10 mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {user ? (
                <Link
                  to={user.role === "recruiter" ? "/recruiter/dashboard" : "/offers"}
                >
                  <Button
                    size="lg"
                    className="min-w-[220px] rounded-sm px-10 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {user.role === "recruiter" ? h.heroDashboard : h.heroBrowse}
                  </Button>
                </Link>
              ) : (
                <Link to={heroGuestHref}>
                  <GlassButton
                    size="lg"
                    className="min-w-[220px]"
                    contentClassName="text-[10px] font-bold uppercase tracking-widest"
                  >
                    {heroGuestLabel}
                  </GlassButton>
                </Link>
              )}
            </div>

            {/* Glass-morphism search bar */}
            <div className="glass-morphism mx-auto w-full max-w-5xl rounded-2xl md:rounded-full p-2 flex flex-col md:flex-row items-center gap-2">
              <div className="flex flex-1 items-center gap-3 px-6 py-3 w-full min-w-0">
                <svg
                  className="h-5 w-5 text-gold-400 shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder={h.filtersKeywordPlaceholder}
                  className="bg-transparent border-none outline-none text-cream-100 placeholder:text-white/50 w-full min-w-0 text-sm font-medium"
                />
              </div>

              <div className="h-8 w-[1px] bg-white/20 hidden md:block" />

              <div className="flex flex-1 items-center justify-between px-6 py-3 w-full min-w-0 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="h-5 w-5 text-gold-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="block min-w-0 truncate text-white/80 text-sm font-medium">
                    {h.filtersLocationPlaceholder}
                  </span>
                </div>
                <svg
                  className="h-4 w-4 text-white/40 group-hover:text-gold-400 transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="h-8 w-[1px] bg-white/20 hidden md:block" />

              <div className="flex flex-1 items-center justify-between px-6 py-3 w-full min-w-0 cursor-pointer group">
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="h-5 w-5 text-gold-400 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                  </svg>
                  <span className="block min-w-0 truncate text-white/80 text-sm font-medium">
                    {h.filtersCategoryAll}
                  </span>
                </div>
                <svg
                  className="h-4 w-4 text-white/40 group-hover:text-gold-400 transition-colors shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <Link to="/offers" className="w-full md:w-auto md:shrink-0">
                <Button
                  className="w-full md:w-auto !rounded-full !px-10 !py-4"
                >
                  {h.filtersSearch}
                </Button>
              </Link>
            </div>

          </div>
        </PageContainer>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-500">
          <span className="text-[10px] uppercase tracking-widest font-bold">Scroll</span>
          <div
            className="w-px h-10 bg-gradient-to-b from-gold-500 to-transparent"
            style={{ animation: "scrollDown 2s ease-in-out infinite" }}
          />
        </div>
      </section>

      {/* ─── CASTING GRID ─── */}
      <section className="py-24 bg-noir-950 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(194,142,76,0.07),transparent_40%)] pointer-events-none" />
        <PageContainer className="relative">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
              {h.gridLabel}
            </span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl md:text-6xl leading-tight sm:whitespace-nowrap">
              {h.gridHeading.split(h.gridInfiniteAccent)[0]}
              <span className="text-gradient-gold italic">{h.gridInfiniteAccent}</span>
              {h.gridHeading.split(h.gridInfiniteAccent)[1]}
            </h2>
            <p className="mt-4 text-cream-500 text-sm">
              {h.heroDesc}
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-nowrap items-center justify-start md:justify-center gap-2 mb-10 overflow-x-auto pb-2 no-scrollbar -mx-4 px-4">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap border ${
                  activeCategory === cat.key
                    ? "bg-gold-500 border-gold-500 text-noir-950 shadow-lg shadow-gold-500/20"
                    : "bg-transparent border-noir-700 text-cream-500 hover:text-cream-100 hover:border-gold-500/40"
                }`}
              >
                {activeCategory === cat.key && (
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                )}
                {cat.label}
              </button>
            ))}
          </div>

          {/* Offer cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
            {recentOffers.length > 0
              ? recentOffers.map((offer, index) => (
                  <Link key={offer.id} to={`/offers/${offer.id}`}>
                    <CastingCard offer={offer} index={index} h={h} />
                  </Link>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCastingCard key={i} />
                ))}
          </div>

          <div className="mt-14 text-center">
            <Link to="/offers">
              <GlassButton
                size="default"
                contentClassName="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                {h.gridViewAll}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </GlassButton>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ─── INFINITE OPPORTUNITIES ─── */}
      <section className="py-24 bg-noir-900 relative">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/sandpaper.png')" }} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,142,76,0.08),transparent_40%)] pointer-events-none" />
        <PageContainer className="relative z-10 text-center">

          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
              {h.gridInfiniteLabel}
            </span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl md:text-6xl leading-tight sm:whitespace-nowrap">
              {h.gridInfiniteHeading.split(h.gridInfiniteAccent)[0]}
              <span className="text-gradient-gold italic">{h.gridInfiniteAccent}</span>
              {h.gridInfiniteHeading.split(h.gridInfiniteAccent)[1]}
            </h2>
            <p className="mt-4 text-cream-500 text-sm">
              {h.heroDesc}
            </p>
          </div>

          {/* Category card stack */}
          <CardStack
            items={[
              {
                id: "film",
                title: "Film",
                imageSrc: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "serie-tv",
                title: "Série TV",
                imageSrc: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "court-metrage",
                title: "Court-métrage",
                imageSrc: "https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "publicite",
                title: "Publicité",
                imageSrc: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "clip-musical",
                title: "Clip musical",
                imageSrc: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "theatre",
                title: "Théâtre",
                imageSrc: "https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "evenement",
                title: "Événement",
                imageSrc: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
            ]}
            initialIndex={0}
            autoAdvance
            intervalMs={3000}
            pauseOnHover
            showDots
            cardWidth={600}
            cardHeight={400}
            renderCard={(item, { active }) => (
              <CategoryCard
                label={item.title}
                image={item.imageSrc!}
                applyLabel={h.gridApply}
                active={active}
                className="h-full"
              />
            )}
          />

          <div className="mt-10">
            <Link to="/offers">
              <GlassButton
                size="default"
                contentClassName="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
              >
                {h.gridViewAll}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </GlassButton>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ─── PERFORMERS SPOTLIGHT ─── */}
      <section className="relative overflow-hidden border-t border-white/5">
        {/* ── Full-section ambient background — changes with active performer ── */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={`section-bg-${performers[activePerformerIdx]?.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <img
                src={performers[activePerformerIdx]?.imageSrc}
                alt=""
                className="h-full w-full object-cover blur-[120px] saturate-150 scale-110"
              />
            </motion.div>
          </AnimatePresence>
          {/* Dark veil so content stays readable */}
          <div className="absolute inset-0 bg-noir-950/80" />
          {/* Bottom fade into the next section */}
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-noir-950" />
          {/* Top fade from previous section */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-noir-900 to-transparent" />
          {/* Subtle gold radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_60%,rgba(194,142,76,0.12),transparent)]" />
        </div>

        {/* ── Header ── */}
        <div className="relative z-10 pt-20 pb-6">
          <PageContainer>
            <div className="text-center">
              <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                Talents d'exception
              </span>
              <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl md:text-6xl leading-tight sm:whitespace-nowrap">
                Nos <span className="text-gradient-gold italic">performeurs</span>
              </h2>
              <p className="mt-4 text-cream-500 text-sm">
                Découvrez les artistes qui font vivre le cinéma, la publicité et la mode au Maroc.
              </p>
            </div>
          </PageContainer>
        </div>

        {/* ── FocusRail — no internal ambient (section handles it) ── */}
        <div className="relative z-10">
          <FocusRail
            items={performers}
            autoPlay
            interval={5000}
            loop
            showAmbience={false}
            onActiveChange={(idx) => setActivePerformerIdx(idx)}
          />
        </div>

        {/* ── CTA ── */}
        <div className="relative z-10 pb-20 text-center">
          <Link to="/talents">
            <GlassButton
              size="default"
              contentClassName="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"
            >
              Voir tous les talents
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
            </GlassButton>
          </Link>
        </div>
      </section>

      {/* ─── WHY CATOURNE (FeatureShowcase match) ─── */}
      <section className="w-full border-t border-b border-white/5 bg-[#0a0a0a] text-cream-100">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-12 md:py-20 lg:gap-14">
          <div className="md:col-span-6">
            <span className="mb-6 inline-flex items-center rounded-sm border border-gold-500 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-gold-500">
              Pourquoi nous ?
            </span>

            <h2 className="font-serif text-4xl font-bold leading-[0.95] text-white sm:text-5xl md:text-6xl sm:whitespace-nowrap">
              Pourquoi <span className="text-gold-500 italic">CATOURNE</span> ?
            </h2>

            <p className="mt-6 text-white/60">
              Nous redéfinissons le casting au Maroc en connectant les meilleurs talents avec les productions les plus prestigieuses.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {["+1000 Castings", "Matching IA", "Profil Premium"].map((stat) => (
                <span
                  key={stat}
                  className="inline-flex items-center rounded-sm border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-white"
                >
                  {stat}
                </span>
              ))}
            </div>

            <div className="mt-10 max-w-xl">
              {whyCatourneSteps.map((step) => (
                <div key={step.id} className="border-b border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      setExpandedWhyStep(expandedWhyStep === step.id ? null : step.id)
                    }
                    className="flex w-full items-center justify-between py-4 text-left font-serif text-base font-medium text-white transition-colors hover:text-gold-500"
                  >
                    <span>{step.title}</span>
                    <span
                      className={`transition-transform duration-200 ${
                        expandedWhyStep === step.id ? "rotate-180" : ""
                      }`}
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </span>
                  </button>
                  {expandedWhyStep === step.id ? (
                    <p className="pb-4 text-sm font-serif text-white/60">
                      {step.text}
                    </p>
                  ) : null}
                </div>
              ))}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="border-none bg-gradient-to-r from-gold-700 via-gold-500 to-gold-400 text-white hover:from-gold-600 hover:via-gold-400 hover:to-gold-300"
                  >
                    Commencer
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="md:col-span-6">
            <div
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-0 shadow-2xl"
              style={{ height: "clamp(320px, 50vw, 600px)" }}
            >
              <div className="relative h-full w-full">
                {whyCatourneTabs.map((tab, index) => (
                  <img
                    key={tab.value}
                    src={tab.src}
                    alt={tab.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    referrerPolicy="no-referrer"
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
                      activeWhyTab === tab.value ? "opacity-100" : "pointer-events-none opacity-0"
                    }`}
                  />
                ))}
              </div>

              <div className="pointer-events-auto absolute inset-x-0 bottom-4 z-10 flex w-full justify-center">
                <div className="flex gap-2 rounded-xl border border-white/10 bg-black/60 p-1 backdrop-blur supports-[backdrop-filter]:bg-black/40">
                  {whyCatourneTabs.map((tab) => (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => setActiveWhyTab(tab.value)}
                      className={`rounded-lg px-4 py-2 font-serif transition-colors ${
                        activeWhyTab === tab.value
                          ? "bg-gold-500 text-white"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="relative overflow-hidden py-40 bg-noir-950">
        {/* Background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_100%,rgba(194,142,76,0.20),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_35%_at_50%_0%,rgba(194,142,76,0.06),transparent)]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.6) 1px,transparent 1px)",
            backgroundSize: "72px 72px",
          }}
        />
        {/* Top & bottom accent lines */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-500/20 to-transparent" />
        {/* Decorative side orbs */}
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl" />
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-gold-500/5 blur-3xl" />

        <PageContainer className="relative z-10 text-center">
          {/* Eyebrow */}
          <div className="mb-10 flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold-500/50" />
            <span className="text-[10px] font-bold uppercase tracking-[0.45em] text-gold-400">
              Commencer aujourd'hui
            </span>
            <span className="h-px w-12 bg-gold-500/50" />
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold leading-[0.92] tracking-tight text-cream-50 text-4xl sm:text-6xl lg:text-8xl mb-8 sm:whitespace-nowrap">
            {h.ctaHeading.split(" ").slice(0, -2).join(" ")}{" "}
            <span className="text-gradient-gold italic">
              {h.ctaHeading.split(" ").slice(-2).join(" ")}
            </span>
          </h2>

          <p className="text-base sm:text-lg text-cream-400 mb-14 leading-relaxed">
            {h.ctaDesc}
          </p>

          {/* Stats row */}
          <div className="mb-14 flex flex-wrap justify-center gap-12">
            {[
              { value: "+500", label: "Talents inscrits" },
              { value: "+200", label: "Castings publiés" },
              { value: "100%", label: "Gratuit pour les talents" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="font-serif text-3xl font-bold text-gold-400">
                  {stat.value}
                </span>
                <span className="mt-1 text-[10px] uppercase tracking-[0.25em] text-cream-500">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <GlassButton
                size="lg"
                contentClassName="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest min-w-[220px] justify-center"
              >
                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                {h.ctaRegister}
              </GlassButton>
            </Link>
            <Link to="/offers">
              <button className="group flex items-center gap-2 px-8 py-4 text-[10px] font-bold uppercase tracking-widest text-cream-300 hover:text-gold-400 transition-colors duration-200">
                {h.ctaBrowse}
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">
                  &rarr;
                </span>
              </button>
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-14 flex flex-wrap justify-center gap-8">
            {[
              "Gratuit pour les talents",
              "Sans engagement",
              "Accès immédiat",
            ].map((badge) => (
              <span
                key={badge}
                className="flex items-center gap-2 text-xs text-cream-600"
              >
                <svg
                  className="h-3.5 w-3.5 shrink-0 text-gold-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {badge}
              </span>
            ))}
          </div>
        </PageContainer>
      </section>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CategoryCard({
  label,
  image,
  applyLabel,
  active = false,
  className = "",
}: {
  label: string;
  image: string;
  applyLabel: string;
  active?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden h-full w-full ${className}`}>
      <img
        src={image}
        alt={label}
        className="absolute inset-0 w-full h-full object-cover"
        draggable={false}
        loading="eager"
        referrerPolicy="no-referrer"
      />
      {/* Bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6">
        <span className="self-start bg-gold-500 text-noir-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-2">
          {label}
        </span>
        <p
          className={`text-xs font-bold uppercase tracking-[0.3em] text-gold-300 transition-all duration-300 ${
            active ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {applyLabel} &rarr;
        </p>
      </div>
    </div>
  );
}


function CastingCard({
  offer,
  index,
  h,
}: {
  offer: Offer;
  index: number;
  h: Record<string, string>;
}) {
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-noir-900/70 shadow-2xl hover:shadow-gold-500/10 transition-all duration-300 hover:-translate-y-1 h-full">
      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="bg-gold-500 text-noir-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {offer.project_type}
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-500">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
        </div>
        <h3 className="font-serif text-xl font-bold text-cream-100 mb-1 transition-colors group-hover:text-gold-400 leading-tight">
          {offer.title}
        </h3>
        <p className="text-sm text-cream-500 mb-4 font-medium">{offer.city}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-cream-400">
            <svg
              className="h-4 w-4 text-gold-500 shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5"
              />
            </svg>
            <span>
              {h.gridDeadline} {formatDate(offer.deadline_at)}
            </span>
          </div>
          {offer.description && (
            <p className="text-sm text-cream-500 line-clamp-2 leading-relaxed">
              {offer.description}
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-white/10">
          <span className="text-xs font-bold uppercase tracking-[0.3em] text-gold-500 group-hover:text-gold-300 transition-colors">
            {h.gridApply} &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}

function SkeletonCastingCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-noir-700/50 bg-noir-900/40">
      <div className="h-48 bg-noir-800/60" />
      <div className="p-6 space-y-4">
        <div className="h-5 w-24 rounded-full bg-noir-700/70" />
        <div className="h-6 w-full rounded-full bg-noir-700/50" />
        <div className="h-6 w-4/5 rounded-full bg-noir-700/40" />
        <div className="space-y-2">
          <div className="h-4 w-2/3 rounded-full bg-noir-700/40" />
          <div className="h-4 w-1/2 rounded-full bg-noir-700/30" />
        </div>
      </div>
    </div>
  );
}
