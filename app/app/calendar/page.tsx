"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Copy, Check, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { PlatformIcon } from "../../../components/posts/PlatformIcon";
import { usePostOSStore } from "../../../lib/store";
import { useToast } from "../../../components/ui/Toast";
import type { Platform, GeneratedPost } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

const DAYS = ["Monday", "Tuesday", "Thursday", "Friday"] as const;

function LinkedInPreview({ post }: { post: GeneratedPost }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">JO</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900">Joy Ogunleye</p>
          <p className="text-[10px] text-gray-400">Founder · ArkNet Digital</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}

function XPreview({ post }: { post: GeneratedPost }) {
  return (
    <div className="bg-black rounded-xl border border-gray-800 p-4">
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold">JO</span>
        </div>
        <div>
          <p className="text-xs font-bold text-white">Joy Ogunleye</p>
          <p className="text-[10px] text-gray-500">@joyogunleye</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}

function InstagramPreview({ post }: { post: GeneratedPost }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-gray-200">
      <div className="h-20 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 flex items-center justify-center px-3">
        <p className="text-white text-[10px] font-semibold text-center line-clamp-2">{post.hook}</p>
      </div>
      <div className="p-3">
        <div className="flex items-center gap-1.5 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center">
            <span className="text-white text-[8px] font-bold">JO</span>
          </div>
          <p className="text-[10px] font-semibold text-gray-900">joyogunleye</p>
        </div>
        <p className="text-[10px] text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-5">{post.content}</p>
      </div>
    </div>
  );
}

function FacebookPreview({ post }: { post: GeneratedPost }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
          <span className="text-white text-[10px] font-bold">JO</span>
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-900">Joy Ogunleye</p>
          <p className="text-[10px] text-gray-400">Just now</p>
        </div>
      </div>
      <p className="text-[11px] text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
    </div>
  );
}

const PREVIEWS: Record<Platform, React.FC<{ post: GeneratedPost }>> = {
  linkedin: LinkedInPreview,
  twitter: XPreview,
  instagram: InstagramPreview,
  facebook: FacebookPreview,
};

function PostCard({ post, onCopy }: { post: GeneratedPost; onCopy: (id: string) => void }) {
  const [copied, setCopied] = useState(false);
  const Preview = PREVIEWS[post.platform];

  function handleCopy() {
    navigator.clipboard.writeText(post.content);
    setCopied(true);
    onCopy(post.id);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-border bg-surface overflow-hidden"
    >
      {/* Post header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <PlatformIcon platform={post.platform} />
          <span className="text-xs font-medium text-muted">{PLATFORM_CONFIG[post.platform].label}</span>
          <span className="text-border">·</span>
          <span className="text-xs text-muted">{post.day}</span>
          {post.content.length > 0 && (
            <>
              <span className="text-border">·</span>
              <span className="text-[10px] text-muted">{post.content.length} chars</span>
            </>
          )}
        </div>
        <button
          onClick={handleCopy}
          className={[
            "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all cursor-pointer border",
            copied
              ? "bg-success/10 text-success border-success/20"
              : "bg-surface-2 text-muted border-border hover:text-foreground hover:border-accent/40",
          ].join(" ")}
        >
          <AnimatePresence mode="wait">
            {copied ? (
              <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Check size={11} />
              </motion.span>
            ) : (
              <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                <Copy size={11} />
              </motion.span>
            )}
          </AnimatePresence>
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* Platform preview */}
      <div className="p-3 bg-[#f0f2f5]">
        <Preview post={post} />
      </div>

      {/* Raw text toggle */}
      <details className="px-4 py-2 border-t border-border">
        <summary className="text-[10px] text-muted cursor-pointer select-none hover:text-foreground transition-colors">
          View raw text
        </summary>
        <p className="text-[11px] text-muted leading-relaxed whitespace-pre-wrap pt-2">{post.content}</p>
      </details>
    </motion.div>
  );
}

export default function CalendarPage() {
  const { state, hydrated, markCopied } = usePostOSStore();
  const { success } = useToast();
  const [activeWeek, setActiveWeek] = useState(1);
  const [activePlatform, setActivePlatform] = useState<Platform | "all">("all");

  const allPosts = state.generatedPosts;
  const maxWeek = Math.max(...(allPosts.length ? allPosts.map((p) => p.week) : [1]));
  const platforms = [...new Set(allPosts.map((p) => p.platform))] as Platform[];

  const filtered = allPosts.filter((p) => {
    const weekMatch = p.week === activeWeek;
    const platformMatch = activePlatform === "all" || p.platform === activePlatform;
    return weekMatch && platformMatch;
  });

  const sortedFiltered = [...filtered].sort((a, b) => {
    return DAYS.indexOf(a.day as typeof DAYS[number]) - DAYS.indexOf(b.day as typeof DAYS[number]);
  });

  function handleCopy(id: string) {
    markCopied(id);
    success("Copied!", "Post content copied to clipboard.");
  }

  if (!hydrated) return null;

  if (allPosts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center py-24 text-center">
        <div className="w-14 h-14 rounded-2xl border border-border bg-surface flex items-center justify-center mb-5">
          <CalendarDays size={24} className="text-muted" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">No posts generated yet</h2>
        <p className="text-sm text-muted mb-6 max-w-xs">Generate your first content calendar to see posts here.</p>
        <Link href="/app/generate">
          <Button><Sparkles size={14} /> Generate posts </ Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Controls */}
      <div className="flex flex-wrap gap-3 items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Content Calendar</h2>
          <p className="text-xs text-muted mt-0.5">{allPosts.length} posts · {allPosts.filter(p => p.copied).length} copied</p>
        </div>
        <Link href="/app/generate">
          <Button variant="secondary" size="sm" icon={<Sparkles size={13} />}>Generate more</Button>
        </Link>
      </div>

      {/* Week selector */}
      {maxWeek > 1 && (
        <div className="flex gap-2 mb-4 flex-wrap">
          {Array.from({ length: maxWeek }, (_, i) => i + 1).map((w) => (
            <button
              key={w}
              onClick={() => setActiveWeek(w)}
              className={[
                "px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                activeWeek === w ? "border-accent/40 bg-accent-soft text-accent-2" : "border-border bg-surface text-muted hover:text-foreground",
              ].join(" ")}
            >
              Week {w}
            </button>
          ))}
        </div>
      )}

      {/* Platform filter */}
      {platforms.length > 1 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          <button
            onClick={() => setActivePlatform("all")}
            className={[
              "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
              activePlatform === "all" ? "border-accent/40 bg-accent-soft text-accent-2" : "border-border bg-surface text-muted hover:text-foreground",
            ].join(" ")}
          >
            All platforms
          </button>
          {platforms.map((p) => (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer",
                activePlatform === p ? "border-accent/40 bg-accent-soft text-accent-2" : "border-border bg-surface text-muted hover:text-foreground",
              ].join(" ")}
            >
              <PlatformIcon platform={p} />
              {PLATFORM_CONFIG[p].label}
            </button>
          ))}
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-4 gap-2 mb-3 hidden md:grid">
        {DAYS.map((d) => (
          <div key={d} className="text-center">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-muted">{d}</span>
          </div>
        ))}
      </div>

      {/* Posts by day */}
      <div className="hidden md:grid grid-cols-4 gap-3">
        {DAYS.map((day) => {
          const dayPosts = sortedFiltered.filter((p) => p.day === day);
          return (
            <div key={day} className="space-y-3">
              {dayPosts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border bg-surface/30 h-32 flex items-center justify-center">
                  <span className="text-xs text-muted/50">No post</span>
                </div>
              ) : (
                dayPosts.map((post) => <PostCard key={post.id} post={post} onCopy={handleCopy} />)
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile: single column */}
      <div className="md:hidden space-y-4">
        {sortedFiltered.map((post) => <PostCard key={post.id} post={post} onCopy={handleCopy} />)}
      </div>

      {/* Week nav */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={() => setActiveWeek((w) => Math.max(1, w - 1))}
          disabled={activeWeek === 1}
          className="text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
        >
          ← Previous week
        </button>
        <Badge variant="default">{filtered.filter(p => p.copied).length}/{filtered.length} copied</Badge>
        <button
          onClick={() => setActiveWeek((w) => Math.min(maxWeek, w + 1))}
          disabled={activeWeek === maxWeek}
          className="text-xs text-muted hover:text-foreground disabled:opacity-30 transition-colors cursor-pointer"
        >
          Next week →
        </button>
      </div>
    </div>
  );
}
