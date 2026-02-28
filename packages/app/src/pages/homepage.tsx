import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { useLang } from "../lib/lang-context";
import { request, formatDate } from "../lib/api";
import type { Offer } from "../lib/types";
import { Button, Badge, PageContainer } from "../components/ui";

export function HomePage() {
  const { user } = useAuth();
  const { t } = useLang();
  const h = t.home;
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);

  useEffect(() => {
    request<{ offers: Offer[] }>("/offers")
      .then((data) => setRecentOffers((data.offers ?? []).slice(0, 6)))
      .catch(() => {});
  }, []);

  return (
    <div>
      {/* ═══════════ SECTION 1: HERO ═══════════ */}
      <section className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background image — Ouarzazate cinematic landscape */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1548018560-c7196e91a0d5?w=1920&q=80')`,
          }}
        />
        {/* Cinematic gradient overlay */}
        <div className="hero-overlay absolute inset-0" />
        {/* Vignette */}
        <div className="vignette absolute inset-0" />
        {/* Warm gold ambient light */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_30%_70%,rgba(194,142,76,0.12),transparent)]" />

        <PageContainer className="relative z-10 py-24">
          <div className="max-w-3xl animate-page-enter">
            {/* Label */}
            <div className="flex items-center gap-3 mb-8">
              <span className="w-8 h-px bg-gold-500" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-400">
                {h.heroLabel}
              </p>
            </div>

            {/* Heading */}
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-cream-50 leading-[1.05] tracking-tight">
              {h.heroHeading}
              <br />
              <span className="text-gradient-gold">{h.heroHeadingAccent}</span>
            </h1>

            {/* Description */}
            <p className="mt-8 text-lg sm:text-xl text-cream-300 max-w-2xl leading-relaxed">
              {h.heroDesc}
            </p>

            {/* Buttons */}
            <div className="mt-12 flex flex-wrap gap-4">
              {user ? (
                <Link to={user.role === "recruiter" ? "/recruiter/dashboard" : "/offers"}>
                  <Button size="lg">
                    {user.role === "recruiter" ? h.heroDashboard : h.heroBrowse}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register?role=performer">
                    <Button size="lg">{h.heroBtnTalent}</Button>
                  </Link>
                  <Link to="/register?role=recruiter">
                    <Button size="lg" variant="outline">{h.heroBtnRecruiter}</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </PageContainer>

        {/* Bottom fade line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-600/30 to-transparent" />
      </section>

      {/* ═══════════ SECTION 2: SEARCH FILTERS ═══════════ */}
      <section className="relative -mt-16 z-20 pb-16">
        <PageContainer>
          <div className="bg-noir-800 border border-noir-700/60 rounded-lg p-6 sm:p-8 shadow-2xl shadow-noir-950/50">
            <h2 className="font-display text-lg font-semibold text-cream-100 mb-6">
              {h.filtersTitle}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Keyword */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">
                  {h.filtersKeyword}
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={h.filtersKeywordPlaceholder}
                    className="w-full bg-noir-900 border border-noir-600 pl-10 pr-4 py-3 text-sm text-cream-100 placeholder:text-noir-400 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600/30 transition-colors rounded-md"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">
                  {h.filtersLocation}
                </label>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-noir-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder={h.filtersLocationPlaceholder}
                    className="w-full bg-noir-900 border border-noir-600 pl-10 pr-4 py-3 text-sm text-cream-100 placeholder:text-noir-400 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600/30 transition-colors rounded-md"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">
                  {h.filtersCategory}
                </label>
                <select className="w-full bg-noir-900 border border-noir-600 px-4 py-3 text-sm text-cream-100 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600/30 transition-colors rounded-md appearance-none">
                  <option>{h.filtersCategoryAll}</option>
                  <option>{h.filtersCategoryActor}</option>
                  <option>{h.filtersCategoryExtra}</option>
                  <option>{h.filtersCategoryTech}</option>
                  <option>{h.filtersCategoryModel}</option>
                  <option>{h.filtersCategoryVoice}</option>
                </select>
              </div>

              {/* Search button */}
              <div className="flex items-end">
                <Link to="/offers" className="w-full">
                  <Button size="lg" className="w-full rounded-md">
                    <svg className="w-4 h-4 me-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    {h.filtersSearch}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ═══════════ SECTION 3: CASTING GRID ═══════════ */}
      <section className="py-20">
        <PageContainer>
          <div className="flex items-end justify-between mb-12 animate-page-enter">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-px bg-gold-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">{h.gridLabel}</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
                {h.gridHeading}
              </h2>
            </div>
            <Link to="/offers" className="hidden sm:block">
              <Button variant="outline" size="sm">{h.gridViewAll}</Button>
            </Link>
          </div>

          {/* Offer cards grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {recentOffers.length > 0 ? (
              recentOffers.map((offer) => (
                <Link key={offer.id} to={`/offers/${offer.id}`}>
                  <div className="group bg-noir-800/60 border border-noir-700 rounded-lg p-6 hover:border-gold-600/40 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <Badge color="primary">{offer.project_type}</Badge>
                      <span className="text-xs text-cream-500/60">
                        {h.gridDeadline} {formatDate(offer.deadline_at)}
                      </span>
                    </div>
                    <h3 className="font-display font-semibold text-cream-100 text-lg mb-3 line-clamp-2 group-hover:text-gold-400 transition-colors duration-200">
                      {offer.title}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-cream-400 mb-4">
                      <svg className="w-4 h-4 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0115 0z" />
                      </svg>
                      {offer.city}
                    </div>
                    {offer.description && (
                      <p className="text-sm text-cream-500 leading-relaxed line-clamp-2 mb-4 flex-grow">
                        {offer.description}
                      </p>
                    )}
                    <div className="mt-auto pt-4 border-t border-noir-700/60">
                      <span className="text-xs font-semibold uppercase tracking-widest text-gold-500 group-hover:text-gold-400 transition-colors">
                        {h.gridApply} &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              /* Placeholder cards when no data */
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-noir-800/40 border border-noir-700/40 rounded-lg p-6 h-52 flex flex-col justify-between">
                  <div>
                    <div className="w-20 h-5 bg-noir-700/60 rounded mb-4" />
                    <div className="w-full h-5 bg-noir-700/40 rounded mb-2" />
                    <div className="w-3/4 h-5 bg-noir-700/30 rounded" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-cream-500/40">
                    <div className="w-3 h-3 rounded-full bg-noir-600/50" />
                    Ouarzazate
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mobile "view all" */}
          <div className="sm:hidden mt-8 text-center">
            <Link to="/offers">
              <Button variant="outline" size="sm">{h.gridViewAll}</Button>
            </Link>
          </div>
        </PageContainer>
      </section>

      {/* ═══════════ SECTION 4: HOW IT WORKS (4 steps) ═══════════ */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-noir-900/60" />
        <PageContainer className="relative">
          <div className="text-center mb-16 animate-page-enter">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="w-6 h-px bg-gold-600" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">{h.howLabel}</p>
              <span className="w-6 h-px bg-gold-600" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
              {h.howHeading}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto stagger-children">
            <StepCard number={1} title={h.step1Title} desc={h.step1Desc} icon="profile" />
            <StepCard number={2} title={h.step2Title} desc={h.step2Desc} icon="search" />
            <StepCard number={3} title={h.step3Title} desc={h.step3Desc} icon="apply" />
            <StepCard number={4} title={h.step4Title} desc={h.step4Desc} icon="star" />
          </div>
        </PageContainer>
      </section>

      {/* ═══════════ SECTION 5: WHY DRAA-TAFILALET ═══════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Background atmosphere */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_50%,rgba(194,142,76,0.06),transparent)]" />

        <PageContainer className="relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: Text */}
            <div className="animate-page-enter">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-6 h-px bg-gold-600" />
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">{h.regionLabel}</p>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-cream-100 mb-6">
                {h.regionHeading}
              </h2>
              <p className="text-cream-400 leading-relaxed text-lg mb-10">
                {h.regionDesc}
              </p>

              {/* Stats grid */}
              <div className="grid grid-cols-2 gap-6">
                <StatCard value={h.regionStat1} label={h.regionStat1Label} />
                <StatCard value={h.regionStat2} label={h.regionStat2Label} />
                <StatCard value={h.regionStat3} label={h.regionStat3Label} />
                <StatCard value={h.regionStat4} label={h.regionStat4Label} />
              </div>
            </div>

            {/* Right: Image */}
            <div className="relative">
              <div className="rounded-lg overflow-hidden border border-noir-700/40">
                <img
                  src="https://images.unsplash.com/photo-1489493585363-d69421e0edd3?w=800&q=80"
                  alt="Ouarzazate - Atlas Studios"
                  className="w-full h-[420px] object-cover"
                  loading="lazy"
                />
              </div>
              {/* Decorative frame accent */}
              <div className="absolute -bottom-3 -right-3 w-full h-full border border-gold-600/20 rounded-lg -z-10" />
            </div>
          </div>
        </PageContainer>
      </section>

      {/* ═══════════ SECTION 6: FINAL CTA ═══════════ */}
      <section className="py-24 relative overflow-hidden">
        {/* Cinematic ambient light */}
        <div className="absolute inset-0 bg-noir-900/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(194,142,76,0.08),transparent)]" />

        <PageContainer className="relative text-center">
          <div className="max-w-2xl mx-auto animate-page-enter">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-cream-100 mb-6 leading-tight">
              {h.ctaHeading}
            </h2>
            <p className="text-cream-400 text-lg mb-10 leading-relaxed">
              {h.ctaDesc}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg">{h.ctaRegister}</Button>
              </Link>
              <Link to="/offers">
                <Button size="lg" variant="outline">{h.ctaBrowse}</Button>
              </Link>
            </div>
          </div>
        </PageContainer>
      </section>
    </div>
  );
}

/* ─── Step Card Component ─── */
function StepCard({ number, title, desc, icon }: { number: number; title: string; desc: string; icon: string }) {
  return (
    <div className="text-center group">
      {/* Icon container */}
      <div className="w-16 h-16 border border-gold-600/30 rounded-lg text-gold-500 flex items-center justify-center mx-auto mb-6 group-hover:border-gold-500/60 group-hover:bg-gold-500/5 transition-all duration-300">
        <StepIcon type={icon} />
      </div>
      {/* Number */}
      <span className="inline-block text-xs font-semibold text-gold-600 mb-3 tracking-widest">
        0{number}
      </span>
      <h3 className="font-display font-semibold text-cream-100 mb-2 text-lg">{title}</h3>
      <p className="text-sm text-cream-500 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ─── Step Icons ─── */
function StepIcon({ type }: { type: string }) {
  const cls = "w-6 h-6";
  switch (type) {
    case "profile":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
      );
    case "search":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      );
    case "apply":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
      );
    case "star":
      return (
        <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

/* ─── Stat Card Component ─── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="border border-noir-700/60 rounded-lg p-5 bg-noir-800/40">
      <p className="font-display font-bold text-gold-400 text-2xl mb-1">{value}</p>
      <p className="text-xs text-cream-500 uppercase tracking-wider">{label}</p>
    </div>
  );
}
