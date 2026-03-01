import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Clock, MessageSquare, ArrowUpRight, Zap } from "lucide-react";
import { cn } from "../../lib/utils";

export type TalentProfileCardProps = {
  name: string;
  meta: string; // "Actrice · Casablanca"
  src: string;
  score?: number; // 0-100
  statusText?: string;
  glowText?: string;
  className?: string;
};

export function TalentProfileCard({
  name,
  meta,
  src,
  score,
  statusText = "Disponible",
  glowText = "Prêt pour de nouveaux projets",
  className,
}: TalentProfileCardProps) {
  const [contacted, setContacted] = useState(false);
  const [barHovered, setBarHovered] = useState(false);

  // Extract role type from meta ("Actrice · Casablanca" → "Actrice")
  const roleType = meta.split("·")[0]?.trim() ?? statusText;

  const timeText = useMemo(() => {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes().toString().padStart(2, "0");
    const hour12 = ((h + 11) % 12) + 1;
    const ampm = h >= 12 ? "PM" : "AM";
    return `${hour12}:${m}${ampm}`;
  }, []);

  const handleContact = () => {
    setContacted(true);
    setTimeout(() => setContacted(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("relative w-full pb-10", className)}
    >
      {/* Gold glow behind card bottom */}
      <div className="pointer-events-none absolute inset-x-4 -bottom-2 top-[70%] rounded-[28px] shadow-[0_32px_64px_-12px_rgba(194,142,76,0.55)] z-0" />

      {/* Glow label below card */}
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 px-4 text-[10px] font-semibold tracking-wide text-gold-500/70 z-0">
        <Zap className="h-3 w-3 shrink-0" />
        <span>{glowText}</span>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full overflow-hidden rounded-[22px] border border-white/8 bg-[radial-gradient(120%_120%_at_30%_10%,#1c1c1c_0%,#0f0f10_60%,#0b0b0c_100%)] shadow-2xl">
        <div className="p-5">

          {/* Status row */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold-500 animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-widest text-gold-400 select-none">
                {roleType}
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-[10px] font-medium text-neutral-400 select-none">
                {statusText}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-neutral-500">
              <Clock className="h-3.5 w-3.5" />
              <span className="tabular-nums text-[11px]">{timeText}</span>
            </div>
          </div>

          {/* Avatar + info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/10">
              <img
                src={src}
                alt={name}
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-serif text-base font-bold tracking-tight text-cream-50">
                {name}
              </h3>
              <p className="mt-0.5 text-[11px] font-semibold text-gold-400 tracking-wide">
                {meta}
              </p>
            </div>
          </div>

          {/* Score progress bar */}
          {score !== undefined && (
            <div
              className="mt-4 cursor-default"
              onMouseEnter={() => setBarHovered(true)}
              onMouseLeave={() => setBarHovered(false)}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                  Score du profil
                </span>
                <motion.span
                  className="text-[11px] font-bold tabular-nums"
                  animate={{ color: barHovered ? "#c28e4c" : "#9e7a3c" }}
                  transition={{ duration: 0.2 }}
                >
                  {score}<span className="text-neutral-600 font-normal">/100</span>
                </motion.span>
              </div>
              {/* Track */}
              <motion.div
                className="w-full rounded-full bg-white/8 overflow-hidden"
                animate={{ height: barHovered ? 8 : 6 }}
                transition={{ duration: 0.2 }}
              >
                {/* Fill */}
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-gold-600 via-gold-500 to-gold-400 relative overflow-hidden"
                  initial={{ width: "0%", boxShadow: "0 0 0px 0px rgba(194,142,76,0)" }}
                  animate={{
                    width: `${score}%`,
                    boxShadow: barHovered
                      ? "0 0 12px 3px rgba(194,142,76,0.65)"
                      : "0 0 0px 0px rgba(194,142,76,0)",
                  }}
                  transition={{
                    width: { duration: 1, ease: "easeOut", delay: 0.3 },
                    boxShadow: { duration: 0.25 },
                  }}
                >
                  {/* Shimmer sweep on hover */}
                  <motion.div
                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/35 to-transparent -skew-x-12"
                    initial={{ x: "-100%" }}
                    animate={{ x: barHovered ? "300%" : "-100%" }}
                    transition={{ duration: 0.55, ease: "easeInOut" }}
                  />
                </motion.div>
              </motion.div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={handleContact}
              className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-white/8 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-gold-500/20 hover:text-gold-400"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              {contacted ? "Envoyé !" : "Contacter"}
            </button>
            <button className="flex h-10 items-center justify-center gap-2 rounded-2xl bg-white/8 text-[10px] font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/15">
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              Voir profil
            </button>
          </div>

        </div>
      </div>
    </motion.div>
  );
}
