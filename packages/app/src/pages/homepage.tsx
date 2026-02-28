import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useLang } from "../lib/lang-context";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Badge, PageContainer } from "../components/ui";
import { CardStack } from "../components/ui/card-stack";
import heroBackground from "../assets/ait-benhaddou-moroccan-ancient-fortress-2026-01-07-06-29-51-utc.jpg";

export function HomePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const h = t.home;
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [heroAudience, setHeroAudience] = useState<"performer" | "recruiter">("performer");

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
  const heroGuestHref =
    heroAudience === "recruiter" ? "/register?role=recruiter" : "/register?role=performer";
  const heroGuestLabel = heroAudience === "recruiter" ? h.heroPostJob : h.heroJoinNow;

  return (
    <div className="bg-noir-950 text-cream-100">

      {/* ─── HERO ─── */}
      <section className="relative flex min-h-[95vh] items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('${heroBackground}')` }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(194,142,76,0.15),transparent_55%)]" />

        <PageContainer className="relative z-10 w-full py-24 sm:py-28">
          <div className="mx-auto max-w-5xl text-center">

            {!user && (
              <div className="mb-8 flex justify-center">
                <div className="inline-flex rounded-full border border-white/10 bg-noir-950/30 p-1 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => setHeroAudience("performer")}
                    className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors sm:px-6 ${
                      heroAudience === "performer"
                        ? "bg-gold-500 text-noir-950"
                        : "text-cream-300 hover:text-cream-100"
                    }`}
                  >
                    {h.heroBtnTalent}
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeroAudience("recruiter")}
                    className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-[0.25em] transition-colors sm:px-6 ${
                      heroAudience === "recruiter"
                        ? "bg-gold-500 text-noir-950"
                        : "text-cream-300 hover:text-cream-100"
                    }`}
                  >
                    {h.heroBtnRecruiter}
                  </button>
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
            <h1 className="font-serif text-5xl font-bold leading-[1.05] tracking-tight text-cream-50 sm:text-7xl lg:text-8xl">
              {h.heroHeading}
              <br />
              <span className="text-gradient-gold italic">{h.heroHeadingAccent}</span>
            </h1>

            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-cream-400 sm:text-xl">
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
                  <Button
                    size="lg"
                    className="min-w-[220px] rounded-sm px-10 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {heroGuestLabel}
                  </Button>
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
            <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-3 block">
              {h.gridLabel}
            </span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl md:text-6xl">
              {h.gridHeading}
            </h2>
            <p className="mt-4 text-cream-400 max-w-xl mx-auto text-sm">
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
              <Button
                variant="outline"
                className="rounded-full px-12 border-white/20 text-cream-100 hover:border-gold-500 text-[10px] uppercase tracking-widest font-bold"
              >
                {h.gridViewAll} &nbsp;&rarr;
              </Button>
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
          <div className="flex flex-col items-center mb-12 gap-5">
            <div className="max-w-3xl">
              <span className="text-gold-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-4 block">
                {h.gridInfiniteLabel}
              </span>
              <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl md:text-6xl leading-tight">
                {h.gridHeading.split(h.gridInfiniteAccent)[0]}
                <span className="text-gradient-gold italic">{h.gridInfiniteAccent}</span>
                {h.gridHeading.split(h.gridInfiniteAccent)[1]}
              </h2>
              <p className="mt-4 text-cream-500 max-w-xl mx-auto text-sm leading-relaxed">
                {h.heroDesc}
              </p>
            </div>
          </div>

          {/* Category card stack */}
          <CardStack
            items={[
              {
                id: "actor",
                title: h.filtersCategoryActor,
                imageSrc: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "extra",
                title: h.filtersCategoryExtra,
                imageSrc: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "model",
                title: h.filtersCategoryModel,
                imageSrc: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "tech",
                title: h.filtersCategoryTech,
                imageSrc: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&q=80&w=800",
                href: "/offers",
              },
              {
                id: "voice",
                title: h.filtersCategoryVoice,
                imageSrc: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
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
              <Button
                variant="outline"
                className="rounded-full px-12 border-white/20 text-cream-100 hover:border-gold-500 text-[10px] uppercase tracking-widest font-bold group"
              >
                {h.gridViewAll}
                <span className="ml-2 inline-block transition-transform duration-200 group-hover:translate-x-1">&rarr;</span>
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="py-32 bg-noir-950 relative overflow-hidden border-t border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(194,142,76,0.07),transparent_55%)] pointer-events-none" />
        <PageContainer className="relative">
          <div className="text-center mb-16">
            <span className="text-gold-500 font-bold uppercase tracking-[0.2em] text-sm mb-4 block">
              {h.howLabel}
            </span>
            <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-6xl">
              {h.howHeading}
            </h2>
            <div className="mt-5 mx-auto w-24 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent" />
          </div>

          <div className="grid gap-6 lg:grid-cols-4">
            <StepCard number={1} title={h.step1Title} desc={h.step1Desc} icon="profile" />
            <StepCard number={2} title={h.step2Title} desc={h.step2Desc} icon="search" />
            <StepCard number={3} title={h.step3Title} desc={h.step3Desc} icon="apply" />
            <StepCard number={4} title={h.step4Title} desc={h.step4Desc} icon="star" />
          </div>

          <div className="mt-16 text-center">
            <Link to="/register">
              <Button
                size="lg"
                className="rounded-full px-12 text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gold-500/10"
              >
                {h.ctaRegister}
              </Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ─── WHY CATOURNE (FeatureShowcase) ─── */}
      <section className="py-24 bg-noir-950 border-t border-white/5">
        <PageContainer>
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Left column */}
            <div>
              <Badge color="primary" className="mb-6">
                {h.howLabel}
              </Badge>
              <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl leading-[1.05]">
                {h.howHeading}
              </h2>
              <p className="mt-6 text-cream-400 leading-relaxed max-w-lg">
                {h.ctaDesc}
              </p>

              {/* Stat chips */}
              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  `${h.regionStat1} ${h.regionStat1Label}`,
                  h.regionStat2Label,
                  `${h.regionStat3} ${h.regionStat3Label}`,
                ].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 rounded-full border border-noir-700 bg-noir-900/60 text-xs text-cream-400 font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>

              {/* Accordion steps */}
              <div className="mt-10 divide-y divide-noir-700/60">
                {[
                  { id: 1, title: h.step1Title, desc: h.step1Desc },
                  { id: 2, title: h.step2Title, desc: h.step2Desc },
                  { id: 3, title: h.step3Title, desc: h.step3Desc },
                ].map((step) => (
                  <div key={step.id}>
                    <button
                      onClick={() =>
                        setExpandedStep(expandedStep === step.id ? null : step.id)
                      }
                      className="w-full flex items-center justify-between py-4 text-left text-base font-medium text-cream-200 hover:text-gold-400 transition-colors font-serif"
                    >
                      <span>{step.title}</span>
                      <span
                        className={`transition-transform duration-200 text-gold-500 ${
                          expandedStep === step.id ? "rotate-180" : ""
                        }`}
                      >
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </span>
                    </button>
                    {expandedStep === step.id && (
                      <p className="pb-4 text-sm text-cream-500 leading-relaxed">
                        {step.desc}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="rounded-sm px-10 text-[10px] font-bold uppercase tracking-widest"
                  >
                    {h.ctaRegister}
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right visual panel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-noir-900/60 shadow-2xl min-h-[500px] lg:min-h-[600px]">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,142,76,0.18),transparent_40%)]" />
              <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(194,142,76,0.04),transparent_40%,rgba(194,142,76,0.1)_100%)]" />
              <div className="relative p-8 h-full flex flex-col justify-between min-h-[500px]">
                <div className="flex flex-wrap gap-3">
                  {[
                    h.filtersCategoryActor,
                    h.filtersCategoryExtra,
                    h.filtersCategoryTech,
                    h.filtersCategoryModel,
                    h.filtersCategoryVoice,
                  ].map((label) => (
                    <div
                      key={label}
                      className="inline-flex items-center rounded-full border border-gold-500/20 bg-noir-950/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cream-300"
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-gold-500 mb-3">
                    CATOURNE
                  </p>
                  <h3 className="font-serif text-2xl font-bold text-cream-100 mb-4">
                    {h.ctaHeading}
                  </h3>
                  <p className="text-sm text-cream-400 leading-relaxed">{h.ctaDesc}</p>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ─── REGION HIGHLIGHT ─── */}
      <section className="relative py-32 overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${heroBackground}')` }}
          />
          <div className="absolute inset-0 bg-noir-950/65 backdrop-blur-[2px]" />
        </div>
        <PageContainer className="relative z-10 text-center">
          <span className="text-gold-400 font-bold uppercase tracking-widest text-sm mb-4 block">
            {h.regionLabel}
          </span>
          <h2 className="font-serif text-4xl font-bold text-cream-100 sm:text-5xl mb-6">
            {h.regionHeading}
          </h2>
          <p className="text-lg text-cream-300 mb-16 max-w-3xl mx-auto font-light leading-relaxed italic">
            "{h.regionDesc}"
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto mb-16">
            {[
              {
                title: "Kasbah Aït Benhaddou",
                desc: "Site classé au patrimoine mondial de l'UNESCO et décor de films légendaires.",
              },
              { title: h.regionStat2, desc: h.regionStat2Label },
              { title: h.regionStat4, desc: h.regionStat4Label },
            ].map((f) => (
              <div key={f.title} className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-gold-500" />
                </div>
                <div>
                  <h4 className="text-cream-100 font-bold mb-2">{f.title}</h4>
                  <p className="text-cream-400 text-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <QuickStat value={h.regionStat1} label={h.regionStat1Label} />
            <QuickStat value={h.regionStat2} label={h.regionStat2Label} />
            <QuickStat value={h.regionStat3} label={h.regionStat3Label} />
            <QuickStat value={h.regionStat4} label={h.regionStat4Label} />
          </div>
        </PageContainer>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-32 bg-noir-900 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(194,142,76,0.1),transparent_35%)] pointer-events-none" />
        <PageContainer className="relative text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-4xl font-bold text-cream-100 mb-8 sm:text-5xl lg:text-7xl">
              {h.ctaHeading}
            </h2>
            <p className="text-lg text-cream-400 mb-12 max-w-2xl mx-auto">
              {h.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button
                  size="lg"
                  className="px-12 rounded-sm text-[10px] font-bold uppercase tracking-widest"
                >
                  {h.ctaRegister}
                </Button>
              </Link>
              <Link to="/offers">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-12 rounded-sm text-[10px] font-bold uppercase tracking-widest border-white/20 text-cream-100 hover:bg-white/10"
                >
                  {h.ctaBrowse}
                </Button>
              </Link>
            </div>
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

function QuickStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-cream-100/10 bg-noir-900/60 px-5 py-4 backdrop-blur-sm text-center">
      <p className="font-serif text-xl font-bold text-gold-400">{value}</p>
      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-cream-500">{label}</p>
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
      {/* Cinematic header area */}
      <div className="relative h-48 overflow-hidden bg-noir-800 shrink-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-800/30 via-noir-800 to-noir-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(194,142,76,0.25),transparent_60%)]" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-noir-900/90 to-transparent" />

        <div className="absolute top-4 left-4">
          <span className="bg-gold-500 text-noir-950 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            {offer.project_type}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-cream-500">
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
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

function StepCard({
  number,
  title,
  desc,
  icon,
}: {
  number: number;
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="group relative overflow-hidden rounded-[2rem] border border-noir-700/70 bg-noir-950/55 p-7">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent opacity-60" />
      <div className="mb-6 flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/20 bg-gold-500/5 text-gold-400 transition-colors duration-300 group-hover:bg-gold-500/10">
          <StepIcon type={icon} />
        </div>
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
          0{number}
        </span>
      </div>
      <h3 className="font-serif text-2xl font-semibold text-cream-100">{title}</h3>
      <p className="mt-4 text-sm leading-relaxed text-cream-400">{desc}</p>
    </div>
  );
}

function StepIcon({ type }: { type: string }) {
  const cls = "h-6 w-6";

  switch (type) {
    case "profile":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
          />
        </svg>
      );
    case "search":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      );
    case "apply":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
          />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
          />
        </svg>
      );
    default:
      return null;
  }
}
