import { useEffect, useState } from "react";
import { request, getApiBase } from "../lib/api";
import { useLang } from "../lib/lang-context";
import type { PerformerProfile } from "../lib/types";
import { Badge, Select, PageContainer, LoadingSpinner } from "../components/ui";

export function TalentsPage() {
  const { t } = useLang();
  const { title, desc } = t.pages.talents;
  const [performers, setPerformers] = useState<PerformerProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("");

  useEffect(() => {
    request<{ performers: PerformerProfile[] }>("/performers")
      .then((data) => setPerformers(data.performers ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cities = [...new Set(performers.map((p) => p.city).filter(Boolean))].sort();
  const specialties = [...new Set(performers.map((p) => p.specialty).filter(Boolean))].sort();

  const filtered = performers.filter((p) => {
    if (cityFilter && p.city !== cityFilter) return false;
    if (specialtyFilter && p.specialty !== specialtyFilter) return false;
    return true;
  });

  return (
    <PageContainer className="py-12 animate-page-enter">
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-600 mb-3">
          {t.castings}
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-cream-100">
          {title}
        </h1>
        <p className="text-cream-500 mt-3 text-sm">{desc}</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-10">
        <div className="w-52">
          <Select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)}>
            <option value="">Toutes les villes</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="w-52">
          <Select value={specialtyFilter} onChange={(e) => setSpecialtyFilter(e.target.value)}>
            <option value="">Toutes les specialites</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>
        {(cityFilter || specialtyFilter) && (
          <button
            className="text-sm text-cream-400 hover:text-gold-400 transition-colors cursor-pointer"
            onClick={() => { setCityFilter(""); setSpecialtyFilter(""); }}
          >
            Effacer les filtres
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-noir-800 border border-noir-700 flex items-center justify-center">
            <svg className="w-7 h-7 text-noir-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4-4v2m22-4l-5 5m0-5l5 5" />
            </svg>
          </div>
          <p className="text-cream-500 text-lg font-display">Aucun talent trouve</p>
          {(cityFilter || specialtyFilter) && (
            <button
              className="mt-4 text-sm text-gold-500 hover:text-gold-400 transition-colors cursor-pointer"
              onClick={() => { setCityFilter(""); setSpecialtyFilter(""); }}
            >
              Effacer les filtres
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="text-xs text-cream-500/60 mb-5">
            {filtered.length} talent{filtered.length !== 1 ? "s" : ""}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 stagger-children">
            {filtered.map((p) => (
              <div key={p.user_id} className="group bg-noir-800/60 border border-noir-700 overflow-hidden hover:border-gold-700/50 transition-all duration-300 h-full flex flex-col">
                  {/* Photo */}
                  <div className="aspect-[3/4] bg-noir-900 relative overflow-hidden">
                    {p.photo_url ? (
                      <img
                        src={p.photo_url.startsWith("http") ? p.photo_url : `${getApiBase()}${p.photo_url}`}
                        alt={p.stage_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-16 h-16 text-noir-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    {/* Specialty badge overlay */}
                    {p.specialty && (
                      <div className="absolute top-3 left-3">
                        <Badge color="primary">{p.specialty}</Badge>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-display font-semibold text-cream-100 group-hover:text-gold-400 transition-colors duration-200 truncate">
                      {p.stage_name || "Sans nom"}
                    </h3>

                    {p.city && (
                      <p className="text-xs text-cream-500/60 mt-1.5 flex items-center gap-1.5">
                        <svg className="w-3 h-3 text-gold-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {p.city}
                      </p>
                    )}

                    {p.languages && p.languages.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {p.languages.map((lang) => (
                          <span key={lang} className="text-[10px] text-cream-400/70 bg-noir-700/80 px-2 py-0.5 rounded-sm">
                            {lang}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
              </div>
            ))}
          </div>
        </>
      )}
    </PageContainer>
  );
}
