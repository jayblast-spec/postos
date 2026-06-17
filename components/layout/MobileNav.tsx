"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Upload, Mic2, Sparkles, CalendarDays } from "lucide-react";

const NAV = [
  { href: "/app/import", label: "Import", icon: Upload },
  { href: "/app/voice", label: "Voice", icon: Mic2 },
  { href: "/app/generate", label: "Generate", icon: Sparkles },
  { href: "/app/calendar", label: "Calendar", icon: CalendarDays },
];

export function MobileNav() {
  const path = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-20 border-t border-border bg-surface/95 backdrop-blur-md">
      <div className="flex">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link key={href} href={href} className={[
              "flex-1 flex flex-col items-center gap-1 py-3 text-[10px] font-medium transition-colors",
              active ? "text-accent-2" : "text-muted",
            ].join(" ")}>
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
