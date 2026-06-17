interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddingStyles = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export function Card({ children, className = "", hover, glow, padding = "md" }: CardProps) {
  return (
    <div className={[
      "rounded-2xl border border-border bg-surface",
      hover && "transition-all duration-200 hover:border-accent/30 hover:bg-surface-2 cursor-pointer",
      glow && "shadow-[0_0_24px_rgba(99,102,241,0.12)]",
      paddingStyles[padding],
      className,
    ].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
