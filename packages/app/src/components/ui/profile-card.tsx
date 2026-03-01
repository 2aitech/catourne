import { motion } from "motion/react";
import { MessageSquare } from "lucide-react";
import { cn } from "../../lib/utils";

export type ProfileCardProps = {
  name: string;
  meta: string;
  src: string;
  className?: string;
  onContact?: () => void;
};

const cardVariants = {
  rest: { scale: 1, transition: { type: "spring", stiffness: 300, damping: 25 } },
  hover: { scale: 1.04, transition: { type: "spring", stiffness: 300, damping: 25 } },
};

const imgVariants = {
  rest: { scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
  hover: { scale: 1.1, transition: { duration: 0.5, ease: "easeOut" } },
};

const overlayVariants = {
  rest: { opacity: 0, transition: { duration: 0.2 } },
  hover: { opacity: 1, transition: { duration: 0.2 } },
};

const buttonVariants = {
  rest: { y: 10, opacity: 0, transition: { duration: 0.2 } },
  hover: { y: 0, opacity: 1, transition: { duration: 0.25, delay: 0.06 } },
};

const infoVariants = {
  rest: { y: 0, transition: { duration: 0.25 } },
  hover: { y: -6, transition: { duration: 0.25 } },
};

export function ProfileCard({ name, meta, src, className, onContact }: ProfileCardProps) {
  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden border border-white/10 shrink-0 cursor-pointer bg-noir-900",
        className
      )}
      style={{ width: 200, height: 280 }}
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
    >
      {/* Portrait image */}
      <motion.img
        src={src}
        alt={name}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
        variants={imgVariants}
      />

      {/* Static gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-noir-950/95 via-noir-950/20 to-transparent pointer-events-none" />

      {/* Hover overlay */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-noir-950/50 backdrop-blur-[3px]"
        variants={overlayVariants}
      >
        <motion.button
          onClick={onContact}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold-500 text-noir-950 text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-gold-500/30 hover:bg-gold-400 transition-colors duration-150"
          variants={buttonVariants}
        >
          <MessageSquare className="w-3.5 h-3.5 shrink-0" />
          Contacter
        </motion.button>
      </motion.div>

      {/* Gold border glow on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl ring-1 ring-gold-500/0 pointer-events-none"
        variants={{
          rest: { boxShadow: "inset 0 0 0 1px rgba(194,142,76,0)" },
          hover: { boxShadow: "inset 0 0 0 1px rgba(194,142,76,0.45)" },
        }}
      />

      {/* Bottom info */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 p-4"
        variants={infoVariants}
      >
        <p className="font-serif font-bold text-cream-50 text-sm leading-tight truncate">{name}</p>
        <p className="text-gold-400 text-[10px] font-semibold mt-0.5 tracking-wide">{meta}</p>
      </motion.div>
    </motion.div>
  );
}
