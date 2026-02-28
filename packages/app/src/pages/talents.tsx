import { useLang } from "../lib/lang-context";

export function TalentsPage() {
  const { t } = useLang();
  const { title, desc } = t.pages.talents;
  return (
    <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-16">
      <h1 className="font-display text-3xl font-bold text-cream-100 mb-4">{title}</h1>
      <p className="text-cream-400 text-sm">{desc}</p>
    </div>
  );
}
