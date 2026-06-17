"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const PAGE_TITLES: Record<string, { title: string; desc: string }> = {
  "/app/import": { title: "Import Posts", desc: "Paste your past social media posts by platform" },
  "/app/voice": { title: "Voice Profile", desc: "AI-extracted analysis of your unique content voice" },
  "/app/generate": { title: "Generate Calendar", desc: "Create a full content calendar in your voice" },
  "/app/calendar": { title: "Content Calendar", desc: "Your generated posts, ready to copy and post" },
};

export function Header() {
  const path = usePathname();
  const info = PAGE_TITLES[path] ?? { title: "Dashboard", desc: "" };

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-surface/60 backdrop-blur-sm sticky top-0 z-10">
      <div>
        <h1 className="text-sm font-bold text-foreground">{info.title}</h1>
        {info.desc && <p className="text-xs text-muted mt-0.5">{info.desc}</p>}
      </div>
      <Link
        href="/"
        className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors"
      >
        <ArrowLeft size={12} />
        Back to home
      </Link>
    </header>
  );
}
