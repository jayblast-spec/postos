"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic2, ArrowRight, Sparkles, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { SkeletonCard } from "../../../components/ui/Skeleton";
import { PlatformIcon } from "../../../components/posts/PlatformIcon";
import { usePostOSStore } from "../../../lib/store";
import { useToast } from "../../../components/ui/Toast";
import type { Platform, VoiceProfile } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

const ENERGY_CONFIG = {
  low: { label: "Low energy", variant: "default" as const, bar: "w-1/4" },
  medium: { label: "Medium energy", variant: "warn" as const, bar: "w-2/4" },
  high: { label: "High energy", variant: "success" as const, bar: "w-3/4" },
  electric: { label: "Electric energy", variant: "accent" as const, bar: "w-full" },
};

function VoiceCard({ profile }: { profile: VoiceProfile }) {
  const energy = ENERGY_CONFIG[profile.energyLevel];
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface p-6 space-y-5"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={profile.platform} />
          <span className="text-sm font-semibold text-foreground">{PLATFORM_CONFIG[profile.platform].label} Voice</span>
        </div>
        <Badge variant="success" dot>Analyzed</Badge>
      </div>

      {/* Tone descriptors */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Tone</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.toneDescriptors.map((t) => (
            <Badge key={t} variant="accent">{t}</Badge>
          ))}
        </div>
      </div>

      {/* Energy bar */}
      <div>
        <div className="flex justify-between mb-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">Energy Level</p>
          <Badge variant={energy.variant}>{energy.label}</Badge>
        </div>
        <div className="h-1.5 rounded-full bg-surface-2 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            className={`h-full rounded-full ${energy.bar} bg-accent`}
            style={{ maxWidth: energy.bar.replace("w-", "").replace("/", "/").replace("full", "100%").replace("1/4", "25%").replace("2/4", "50%").replace("3/4", "75%") }}
          />
        </div>
      </div>

      {/* Framing style */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1.5">Framing Style</p>
        <p className="text-sm text-foreground leading-relaxed">{profile.framingStyle}</p>
      </div>

      {/* Topics */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Core Topics</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.topics.map((t) => (
            <span key={t} className="text-xs text-muted border border-border rounded-lg px-2.5 py-1">{t}</span>
          ))}
        </div>
      </div>

      {/* Signature phrases */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Signature Phrases</p>
        <div className="space-y-1">
          {profile.signaturePhrases.map((p) => (
            <p key={p} className="text-sm text-foreground font-mono bg-surface-2 rounded-lg px-3 py-1.5 border border-border">
              &ldquo;{p}&rdquo;
            </p>
          ))}
        </div>
      </div>

      {/* Hook patterns */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-2">Hook Patterns</p>
        <div className="flex flex-wrap gap-1.5">
          {profile.hookPatterns.map((h) => (
            <Badge key={h} variant="gold">{h}</Badge>
          ))}
        </div>
      </div>

      {/* Writing style */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1.5">Writing Style</p>
        <p className="text-xs text-muted leading-relaxed">{profile.writingStyle}</p>
      </div>

      {/* Hashtag strategy */}
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted mb-1.5">Hashtag Strategy</p>
        <p className="text-xs text-muted leading-relaxed">{profile.hashtagStrategy}</p>
      </div>

      <div className="pt-1 border-t border-border text-[10px] text-muted">
        Based on {profile.postCount} post{profile.postCount !== 1 ? "s" : ""} · Analyzed {new Date(profile.analyzedAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}

export default function VoicePage() {
  const { state, hydrated, setVoiceProfile } = usePostOSStore();
  const { success, error, info } = useToast();
  const [loading, setLoading] = useState<Platform | null>(null);

  const platforms = [...new Set(state.importedPosts.map((p) => p.platform))] as Platform[];
  const hasProfiles = Object.keys(state.voiceProfiles).length > 0;

  async function analyzeVoice(platform: Platform) {
    const posts = state.importedPosts.filter((p) => p.platform === platform).map((p) => p.content);
    if (posts.length < 1) {
      info("No posts", `Import some ${PLATFORM_CONFIG[platform].label} posts first.`);
      return;
    }
    setLoading(platform);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts, platform }),
      });
      if (!res.ok) throw new Error("Failed");
      const { profile, demo } = await res.json();
      setVoiceProfile(profile);
      success(
        `${PLATFORM_CONFIG[platform].label} voice analyzed`,
        demo ? "Demo mode — add GROQ_API_KEY for real AI analysis." : "Your voice fingerprint is ready."
      );
    } catch {
      error("Analysis failed", "Could not analyze your voice. Try again.");
    } finally {
      setLoading(null);
    }
  }

  if (!hydrated) return null;

  if (platforms.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl border border-border bg-surface flex items-center justify-center mb-5">
          <Mic2 size={24} className="text-muted" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No posts imported yet</h2>
        <p className="text-sm text-muted mb-6 max-w-xs">Import your past posts first so PostOS can learn your voice.</p>
        <Link href="/app/import">
          <Button>Go to import <ArrowRight size={13} /></Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Voice Profile</h2>
          <p className="text-xs text-muted mt-0.5">Analyze each platform to extract your unique voice fingerprint.</p>
        </div>
        {hasProfiles && (
          <Link href="/app/generate">
            <Button size="sm">
              Generate calendar
              <ArrowRight size={13} />
            </Button>
          </Link>
        )}
      </div>

      {/* Platform analysis buttons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {platforms.map((p) => {
          const count = state.importedPosts.filter((post) => post.platform === p).length;
          const profile = state.voiceProfiles[p];
          const isLoading = loading === p;
          return (
            <button
              key={p}
              onClick={() => analyzeVoice(p)}
              disabled={isLoading}
              className={[
                "rounded-2xl border p-4 text-left transition-all cursor-pointer group",
                profile ? "border-success/30 bg-success/5 hover:border-success/50" : "border-border bg-surface hover:border-accent/40",
              ].join(" ")}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: PLATFORM_CONFIG[p].color + "22" }}>
                  <PlatformIcon platform={p} size={18} />
                </div>
                {isLoading && <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />}
                {!isLoading && profile && <Badge variant="success" dot>Done</Badge>}
              </div>
              <p className="text-sm font-medium text-foreground mb-0.5">{PLATFORM_CONFIG[p].label}</p>
              <p className="text-[11px] text-muted">{count} post{count !== 1 ? "s" : ""} imported</p>
              <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-accent-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {profile ? <RefreshCw size={11} /> : <Sparkles size={11} />}
                {profile ? "Re-analyze" : "Analyze voice"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Loading skeletons */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted">Analyzing your {PLATFORM_CONFIG[loading].label} voice...</span>
            </div>
            <SkeletonCard />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice profiles */}
      <div className="grid md:grid-cols-2 gap-5">
        {(Object.values(state.voiceProfiles) as VoiceProfile[]).map((profile) => (
          <VoiceCard key={profile.platform} profile={profile} />
        ))}
      </div>
    </div>
  );
}
