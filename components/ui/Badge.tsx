type Variant = "default" | "success" | "warn" | "danger" | "gold" | "accent" | "platform";

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<Variant, string> = {
  default: "bg-surface-2 text-muted border border-border",
  success: "bg-success/10 text-success border border-success/20",
  warn: "bg-warn/10 text-warn border border-warn/20",
  danger: "bg-danger/10 text-danger border border-danger/20",
  gold: "bg-[rgba(212,168,83,0.12)] text-gold border border-[rgba(212,168,83,0.25)]",
  accent: "bg-accent-soft text-accent-2 border border-accent/20",
  platform: "bg-surface-2 text-foreground border border-border",
};

export function Badge({ children, variant = "default", className = "", dot }: BadgeProps) {
  return (
    <span className={[
      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium",
      variantStyles[variant],
      className,
    ].join(" ")}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
