"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Zap, ArrowRight, Upload, Mic2, CalendarDays, Sparkles,
  Fingerprint, Clock, Globe2, AlignLeft, Hash, BookOpen, Check, ChevronRight
} from "lucide-react";
import { Button } from "../components/ui/Button";

function FloatingLinkedInCard() {
  return (
    <div className="float-a w-64 bg-white rounded-2xl shadow-2xl p-4 select-none">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">JO</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900">Joy Ogunleye</p>
          <p className="text-[10px] text-gray-500">Founder · ArkNet Digital</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-700 leading-relaxed mb-2">
        The future of business is not just digital — it&apos;s <span className="font-semibold text-indigo-600">intelligent infrastructure</span>. Here&apos;s what that actually means for founders building in 2026...
      </p>
      <div className="flex gap-1 flex-wrap">
        {["#AIStrategy", "#Founders", "#FutureOfWork"].map((t) => (
          <span key={t} className="text-[9px] text-blue-600 font-medium">{t}</span>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
        <span className="text-[10px] text-gray-400">👍 142</span>
        <span className="text-[10px] text-gray-400">💬 38 comments</span>
      </div>
    </div>
  );
}

function FloatingXCard() {
  return (
    <div className="float-b w-56 bg-black rounded-2xl shadow-2xl p-4 border border-gray-800 select-none">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">JO</span>
        </div>
        <div>
          <p className="text-[11px] font-bold text-white">Joy Ogunleye</p>
          <p className="text-[10px] text-gray-500">@joyogunleye</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-200 leading-relaxed">
        AI is not replacing creativity. It&apos;s amplifying it. The founders who understand this first will win.
      </p>
      <p className="text-[10px] text-sky-400 mt-1.5">#AI #Startups #BuildInPublic</p>
    </div>
  );
}

function FloatingInstagramCard() {
  return (
    <div className="float-c w-48 bg-white rounded-2xl shadow-2xl overflow-hidden select-none">
      <div className="h-28 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center">
        <p className="text-white text-xs font-bold text-center px-3 leading-tight">
          Build the future you want to live in.
        </p>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">JO</span>
          </div>
          <p className="text-[10px] font-semibold text-gray-900">joyogunleye</p>
        </div>
        <p className="text-[9px] text-gray-500">1.2K likes · 89 comments</p>
      </div>
    </div>
  );
}

const FEATURES = [
  { icon: Fingerprint, title: "Voice Fingerprinting", desc: "AI extracts your tone, energy, framing, and positioning from your past posts." },
  { icon: CalendarDays, title: "1–3 Week Calendars", desc: "Generate a full content schedule with 4 posts per week — Monday through Friday." },
  { icon: Globe2, title: "Platform-Native Format", desc: "Every post is length-correct and styled for LinkedIn, X, Instagram, or Facebook." },
  { icon: AlignLeft, title: "Full-Length Posts", desc: "No half-posts. LinkedIn gets 1300 chars, Instagram 2200 — the full content piece." },
  { icon: Hash, title: "Hashtag Intelligence", desc: "Learns your hashtag patterns and replicates them in every generated post." },
  { icon: BookOpen, title: "Hook Pattern Library", desc: "Studies your opening lines and generates hooks in your proven style." },
];

const STATS = [
  { value: "10,000+", label: "Posts generated" },
  { value: "4", label: "Platforms supported" },
  { value: "3 weeks", label: "Max calendar length" },
  { value: "< 30s", label: "Generation time" },
];

const PRICING = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Get started with one platform",
    features: ["1 platform", "1 week calendar", "4 posts", "Voice fingerprinting", "Copy to clipboard"],
    cta: "Start Free",
    accent: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/mo",
    desc: "Full power for content creators",
    features: ["All 4 platforms", "3 week calendars", "48 posts/cycle", "Multi-platform voice", "Priority generation", "Export to CSV"],
    cta: "Start Pro",
    accent: true,
  },
  {
    name: "Agency",
    price: "$49",
    period: "/mo",
    desc: "Manage multiple client voices",
    features: ["5 workspaces", "All Pro features", "Client voice profiles", "Batch generation", "Team access"],
    cta: "Start Agency",
    accent: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background gradient-mesh">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/70">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-accent glow-pulse flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold tracking-tight">PostOS</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/app/import" className="text-sm text-muted hover:text-foreground transition-colors hidden sm:block">
            Dashboard
          </Link>
          <Link href="/app/import">
            <Button size="sm">
              Start Free
              <ArrowRight size={13} />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 pt-20 pb-28 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/30 bg-accent-soft text-accent-2 text-xs font-medium mb-6">
            <Sparkles size={12} />
            AI-powered content engine
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
            Your voice.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accent-2">Amplified.</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed mb-8">
            Paste your past posts. PostOS learns exactly how you write — your tone, energy, hooks, hashtags — and generates weeks of authentic content in your voice.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/app/import">
              <Button size="lg">
                <Zap size={16} />
                Start for free
                <ArrowRight size={15} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="secondary" size="lg">
                See how it works
              </Button>
            </a>
          </div>
        </motion.div>

        {/* Floating mockups */}
        <div className="relative mt-16 max-w-4xl mx-auto h-64 flex items-center justify-center">
          <div className="absolute left-4 md:left-16 top-4">
            <FloatingLinkedInCard />
          </div>
          <div className="absolute right-4 md:right-12 top-0">
            <FloatingXCard />
          </div>
          <div className="absolute left-1/2 -translate-x-1/2 bottom-0 hidden md:block">
            <FloatingInstagramCard />
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-6 py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted text-center mb-3">How it works</p>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Three steps to your calendar</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", icon: Upload, title: "Import your posts", desc: "Paste 3–20 of your past posts from any platform. The more you give, the better PostOS understands you." },
              { step: "02", icon: Mic2, title: "AI learns your voice", desc: "PostOS analyzes your tone, energy, framing, hooks, hashtag strategy, and writing style in seconds." },
              { step: "03", icon: CalendarDays, title: "Generate your calendar", desc: "Choose a platform and duration. Get a full week of authentic, full-length posts ready to copy." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="relative rounded-2xl border border-border bg-surface p-6"
              >
                <div className="absolute top-5 right-5 text-3xl font-black text-border">{s.step}</div>
                <div className="w-10 h-10 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center mb-4">
                  <s.icon size={18} className="text-accent-2" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform logos */}
      <section className="px-6 py-12 border-t border-border/40">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-6">Supported platforms</p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {[
              { name: "LinkedIn", color: "#0077b5" },
              { name: "X", color: "#1d9bf0" },
              { name: "Instagram", color: "#e1306c" },
              { name: "Facebook", color: "#1877f2" },
            ].map((p) => (
              <div key={p.name} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
                <span className="text-sm font-medium text-muted">{p.name}</span>
              </div>
            ))}
            <div className="flex items-center gap-2 opacity-40">
              <div className="w-2 h-2 rounded-full bg-border" />
              <span className="text-sm font-medium text-muted">TikTok</span>
              <span className="text-[10px] text-muted border border-border rounded px-1.5 py-0.5">Soon</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted text-center mb-3">Features</p>
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Everything you need</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-border bg-surface p-5 hover:border-accent/30 transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-accent-soft border border-accent/20 flex items-center justify-center mb-3">
                  <f.icon size={16} className="text-accent-2" />
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1.5">{f.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-14 border-t border-border/40">
        <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-black text-accent">{s.value}</p>
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted text-center mb-3">Pricing</p>
          <h2 className="text-3xl font-bold text-center text-foreground mb-2">Simple, transparent pricing</h2>
          <p className="text-center text-muted text-sm mb-10">Start free. Upgrade when you need more.</p>
          <div className="grid md:grid-cols-3 gap-5">
            {PRICING.map((p) => (
              <div
                key={p.name}
                className={[
                  "rounded-2xl border p-6 relative",
                  p.accent
                    ? "border-accent/40 bg-accent-soft shadow-[0_0_40px_rgba(99,102,241,0.15)]"
                    : "border-border bg-surface",
                ].join(" ")}
              >
                {p.accent && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent rounded-full text-[10px] font-bold text-white">
                    Most Popular
                  </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-1">{p.name}</p>
                <div className="flex items-end gap-0.5 mb-1">
                  <span className="text-3xl font-black text-foreground">{p.price}</span>
                  <span className="text-sm text-muted mb-1">{p.period}</span>
                </div>
                <p className="text-xs text-muted mb-5">{p.desc}</p>
                <ul className="space-y-2 mb-6">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-muted">
                      <Check size={13} className="text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href="/app/import" className="block">
                  <Button variant={p.accent ? "primary" : "secondary"} className="w-full justify-center">
                    {p.cta}
                    <ChevronRight size={13} />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 border-t border-border/40">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent glow-pulse flex items-center justify-center mx-auto mb-6">
            <Zap size={22} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">Start building your voice today</h2>
          <p className="text-muted mb-8">Import your first posts in under a minute. No account required.</p>
          <Link href="/app/import">
            <Button size="lg">
              <Zap size={16} />
              Get started free
              <ArrowRight size={15} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-10">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center">
              <Zap size={12} className="text-white" />
            </div>
            <span className="text-sm font-bold">PostOS</span>
          </div>
          <p className="text-xs text-muted">Built by <a href="https://arknet.digital" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">ArkNet Digital</a></p>
          <div className="flex items-center gap-5">
            {[
              { name: "BriefOS", url: "https://briefos-silk.vercel.app" },
              { name: "RoleForge", url: "https://roleforge-five.vercel.app" },
              { name: "OpsIntel", url: "https://opsintel-delta.vercel.app" },
            ].map((t) => (
              <a key={t.name} href={t.url} target="_blank" rel="noopener noreferrer" className="text-xs text-muted hover:text-foreground transition-colors">
                {t.name}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
