import type { ButtonHTMLAttributes, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

// ---------- Button ----------
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

const btnBase = "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-noir-900 disabled:opacity-40 disabled:pointer-events-none cursor-pointer";

const btnVariants: Record<ButtonVariant, string> = {
  primary: "bg-gold-500 text-noir-950 hover:bg-gold-400 focus:ring-gold-500 rounded-sm",
  secondary: "bg-cream-100 text-noir-900 hover:bg-cream-50 focus:ring-cream-300 rounded-sm",
  outline: "border border-noir-500 bg-transparent text-cream-300 hover:border-gold-600 hover:text-gold-400 focus:ring-gold-500 rounded-sm",
  ghost: "text-cream-400 hover:text-gold-400 hover:bg-noir-800 focus:ring-gold-500 rounded-sm",
  danger: "bg-wine-700 text-cream-100 hover:bg-wine-600 focus:ring-wine-500 rounded-sm",
};

const btnSizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-1.5 text-xs uppercase tracking-widest",
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-sm uppercase tracking-widest",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      className={`${btnBase} ${btnVariants[variant]} ${btnSizes[size]} ${className}`}
      {...props}
    />
  );
}

// ---------- Input ----------
const inputBase = "w-full bg-noir-800 border border-noir-600 px-4 py-3 text-sm text-cream-100 placeholder:text-noir-400 focus:border-gold-600 focus:outline-none focus:ring-1 focus:ring-gold-600/30 transition-colors rounded-sm";

export function Input({
  label,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  if (label) {
    return (
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">{label}</span>
        <input className={`${inputBase} ${className}`} {...props} />
      </label>
    );
  }
  return <input className={`${inputBase} ${className}`} {...props} />;
}

// ---------- Textarea ----------
export function Textarea({
  label,
  className = "",
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }) {
  const cls = `${inputBase} resize-vertical ${className}`;
  if (label) {
    return (
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">{label}</span>
        <textarea className={cls} {...props} />
      </label>
    );
  }
  return <textarea className={cls} {...props} />;
}

// ---------- Select ----------
export function Select({
  label,
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  const cls = `${inputBase} ${className}`;
  if (label) {
    return (
      <label className="block">
        <span className="block text-xs font-medium uppercase tracking-widest text-cream-400 mb-2">{label}</span>
        <select className={cls} {...props} />
      </label>
    );
  }
  return <select className={cls} {...props} />;
}

// ---------- Card ----------
export function Card({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { children: ReactNode }) {
  return (
    <div
      className={`bg-noir-800/60 border border-noir-700 backdrop-blur-sm ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ---------- Badge ----------
type BadgeColor = "primary" | "accent" | "gray" | "red" | "green" | "blue";

const badgeColors: Record<BadgeColor, string> = {
  primary: "bg-gold-500/15 text-gold-400 border border-gold-500/20",
  accent: "bg-gold-500/10 text-gold-300 border border-gold-500/15",
  gray: "bg-noir-700 text-cream-400 border border-noir-600",
  red: "bg-wine-700/20 text-wine-400 border border-wine-700/30",
  green: "bg-jade-600/15 text-jade-500 border border-jade-600/20",
  blue: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
};

export function Badge({
  children,
  color = "gray",
  className = "",
}: {
  children: ReactNode;
  color?: BadgeColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest ${badgeColors[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// ---------- Loading Spinner ----------
export function LoadingSpinner({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <div className="relative h-8 w-8">
        <div className="absolute inset-0 rounded-full border-2 border-noir-700" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold-500 animate-spin" />
      </div>
    </div>
  );
}

// ---------- Page Container ----------
export function PageContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
