"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Upload, Mic2, Sparkles, CalendarDays, Zap } from "lucide-react";

const NAV = [
  { href: "/app/import", label: "Import Posts", icon: Upload },
  { href: "/app/voice", label: "Voice Profile", icon: Mic2 },
  { href: "/app/generate", label: "Generate", icon: Sparkles },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
];

export function Sidebar() {
  const path = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 shrink-0 border-r border-border bg-surface h-screen sticky top-0 overflow-y-auto">
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
          <Zap size={14} className="text-white" />
        </div>
        <span className="text-sm font-bold tracking-tight text-foreground">PostOS</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} className="block relative">
              {active && (
                <motion.div
                  layoutId="sidebar-pill"
                  className="absolute inset-0 rounded-xl bg-accent-soft border border-accent/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span className={[
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
                active ? "text-accent-2" : "text-muted hover:text-foreground hover:bg-surface-2",
              ].join(" ")}>
                <Icon size={16} className="shrink-0" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5">
        <div className="rounded-xl border border-gold/20 bg-[rgba(212,168,83,0.06)] p-3.5">
          <p className="text-xs font-semibold text-gold mb-0.5">PostOS Pro</p>
          <p className="text-[11px] text-muted leading-relaxed">All platforms · 3-week calendar · coming soon</p>
        </div>
      </div>
    </aside>
  );
}
