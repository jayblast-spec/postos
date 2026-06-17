"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, CalendarDays } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { PlatformIcon } from "../../../components/posts/PlatformIcon";
import { usePostOSStore } from "../../../lib/store";
import { useToast } from "../../../components/ui/Toast";
import type { Platform } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

const WEEK_OPTIONS = [
  { value: 1, label: "1 week", posts: 4, desc: "4 posts · Mon/Tue/Thu/Fri" },
  { value: 2, label: "2 weeks", posts: 8, desc: "8 posts · Mon/Tue/Thu/Fri" },
  { value: 3, label: "3 weeks", posts: 12, desc: "12 posts · Mon/Tue/Thu/Fri" },
];

export default function GeneratePage() {
  const { state, hydrated, addCampaign } = usePostOSStore();
  const { success, error, info } = useToast();
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [selectedWeeks, setSelectedWeeks] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  const availablePlatforms = Object.keys(state.voiceProfiles) as Platform[];

  async function generate() {
    if (!selectedPlatform) {
      info("Select a platform", "Choose which platform to generate posts for.");
      return;
    }
    const voiceProfile = state.voiceProfiles[selectedPlatform];
    if (!voiceProfile) {
      info("No voice profile", `Analyze your ${PLATFORM_CONFIG[selectedPlatform].label} voice first.`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voiceProfile, platform: selectedPlatform, durationWeeks: selectedWeeks }),
      });
      if (!res.ok) throw new Error("Failed");
      const { posts, demo } = await res.json();

      addCampaign(
        { platform: selectedPlatform, durationWeeks: selectedWeeks, postCount: posts.length },
        posts.map((p: { week: number; day: string; hook: string; content: string }) => ({
          platform: selectedPlatform,
          content: p.content,
          week: p.week,
          day: p.day,
          hook: p.hook,
        }))
      );

      success(
        `${posts.length} posts generated`,
        demo ? "Demo mode — add GROQ_API_KEY for real AI content." : "Your content calendar is ready."
      );
    } catch {
      error("Generation failed", "Could not generate posts. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) return null;

  if (availablePlatforms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl border border-border bg-surface flex items-center justify-center mb-5">
          <Sparkles size={24} className="text-muted" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">Analyze your voice first</h2>
        <p className="text-sm text-muted mb-6 max-w-xs">You need at least one voice profile before generating a content calendar.</p>
        <Link href="/app/voice">
          <Button>Go to Voice Profile <ArrowRight size={13} /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-base font-semibold text-foreground mb-1">Generate your calendar</h2>
        <p className="text-xs text-muted">Choose a platform and duration to generate full-length posts in your voice.</p>
      </div>

      {/* Platform selection */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Select platform</p>
        <div className="grid grid-cols-2 gap-3">
          {availablePlatforms.map((p) => {
            const selected = selectedPlatform === p;
            return (
              <button
                key={p}
                onClick={() => setSelectedPlatform(p)}
                className={[
                  "rounded-2xl border p-4 text-left transition-all cursor-pointer",
                  selected ? "border-accent/40 bg-accent-soft" : "border-border bg-surface hover:border-border",
                ].join(" ")}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PLATFORM_CONFIG[p].color + "22" }}>
                    <PlatformIcon platform={p} size={18} />
                  </div>
                  {selected && <Badge variant="accent">Selected</Badge>}
                </div>
                <p className="text-sm font-semibold text-foreground">{PLATFORM_CONFIG[p].label}</p>
                <p className="text-[11px] text-muted">{PLATFORM_CONFIG[p].charLimit} char limit</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration selection */}
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Calendar duration</p>
        <div className="grid grid-cols-3 gap-3">
          {WEEK_OPTIONS.map((w) => {
            const selected = selectedWeeks === w.value;
            return (
              <button
                key={w.value}
                onClick={() => setSelectedWeeks(w.value as 1 | 2 | 3)}
                className={[
                  "rounded-2xl border p-4 text-left transition-all cursor-pointer",
                  selected ? "border-accent/40 bg-accent-soft" : "border-border bg-surface hover:border-border",
                ].join(" ")}
              >
                <p className="text-sm font-bold text-foreground mb-0.5">{w.label}</p>
                <p className="text-[10px] text-muted">{w.desc}</p>
                {w.value === 3 && (
                  <span className="mt-2 inline-block text-[9px] px-1.5 py-0.5 rounded-full border border-gold/30 text-gold">Pro</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + generate */}
      {selectedPlatform && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-surface p-5 mb-6"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-muted mb-3">Summary</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <PlatformIcon platform={selectedPlatform} size={16} />
              <span className="text-sm text-foreground font-medium">{PLATFORM_CONFIG[selectedPlatform].label}</span>
            </div>
            <span className="text-border">·</span>
            <span className="text-sm text-muted">{selectedWeeks} week{selectedWeeks > 1 ? "s" : ""}</span>
            <span className="text-border">·</span>
            <span className="text-sm text-muted">{selectedWeeks * 4} posts</span>
            <span className="text-border">·</span>
            <Badge variant="gold">Full-length · {PLATFORM_CONFIG[selectedPlatform].charLimit} chars</Badge>
          </div>
        </motion.div>
      )}

      <Button
        size="lg"
        onClick={generate}
        loading={loading}
        disabled={!selectedPlatform}
        className="w-full justify-center"
        icon={loading ? undefined : <Sparkles size={16} />}
      >
        {loading ? `Generating ${selectedWeeks * 4} posts in your voice...` : `Generate ${selectedWeeks * 4} posts`}
      </Button>

      {state.campaigns.length > 0 && (
        <div className="mt-6 text-center">
          <Link href="/app/calendar" className="text-sm text-accent-2 hover:text-accent transition-colors inline-flex items-center gap-1.5">
            <CalendarDays size={13} />
            View your {state.generatedPosts.length} generated posts
          </Link>
        </div>
      )}
    </div>
  );
}
