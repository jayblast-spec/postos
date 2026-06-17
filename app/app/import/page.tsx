"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, Trash2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Input";
import { Badge } from "../../../components/ui/Badge";
import { PlatformIcon } from "../../../components/posts/PlatformIcon";
import { usePostOSStore } from "../../../lib/store";
import { useToast } from "../../../components/ui/Toast";
import type { Platform } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

const PLATFORM_EXAMPLE: Record<Platform, string> = {
  linkedin: "The future of business isn't just digital — it's intelligent infrastructure.\n\nHere's what I've learned building in public for 3 years...\n\n#AI #Startups #FutureOfWork",
  twitter: "AI isn't replacing creativity. It's amplifying it.\n\nThe founders who understand this first will win. 🧠⚡\n\n#AI #BuildInPublic",
  instagram: "Build the future you want to live in. 🌍\n\nEvery day is a chance to create something that didn't exist before. That's why I started ArkNet Digital — because the tools I needed didn't exist.\n\n#Founder #StartupLife #ArkNet",
  facebook: "Something I've been thinking about lately — most people wait for permission to start. The truth is, the only permission you need is your own.",
};

export default function ImportPage() {
  const { state, hydrated, addPosts, removePlatformPosts } = usePostOSStore();
  const { success, error } = useToast();
  const [activePlatform, setActivePlatform] = useState<Platform>("linkedin");
  const [drafts, setDrafts] = useState<Record<Platform, string[]>>({
    linkedin: [""],
    twitter: [""],
    instagram: [""],
    facebook: [""],
  });

  const platformPosts = state.importedPosts.filter((p) => p.platform === activePlatform);
  const activeDrafts = drafts[activePlatform];
  const totalImported = state.importedPosts.length;

  function updateDraft(idx: number, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [activePlatform]: prev[activePlatform].map((d, i) => (i === idx ? value : d)),
    }));
  }

  function addDraft() {
    setDrafts((prev) => ({
      ...prev,
      [activePlatform]: [...prev[activePlatform], ""],
    }));
  }

  function removeDraft(idx: number) {
    setDrafts((prev) => ({
      ...prev,
      [activePlatform]: prev[activePlatform].filter((_, i) => i !== idx),
    }));
  }

  function handleSave() {
    const valid = activeDrafts.filter((d) => d.trim().length >= 20);
    if (valid.length === 0) {
      error("No valid posts", "Each post must be at least 20 characters.");
      return;
    }
    addPosts(valid.map((content) => ({ platform: activePlatform, content: content.trim() })));
    setDrafts((prev) => ({ ...prev, [activePlatform]: [""] }));
    success(`${valid.length} post${valid.length > 1 ? "s" : ""} imported`, `Added to your ${PLATFORM_CONFIG[activePlatform].label} voice profile.`);
  }

  function handleClearPlatform() {
    removePlatformPosts(activePlatform);
    success("Cleared", `${PLATFORM_CONFIG[activePlatform].label} posts removed.`);
  }

  const limit = PLATFORM_CONFIG[activePlatform].charLimit;

  if (!hydrated) return null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header row */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-foreground">Import your past posts</h2>
          <p className="text-xs text-muted mt-0.5">Paste 3–20 posts per platform for the best voice analysis.</p>
        </div>
        {totalImported > 0 && (
          <Link href="/app/voice">
            <Button size="sm">
              Analyze voice
              <ArrowRight size={13} />
            </Button>
          </Link>
        )}
      </div>

      {/* Platform tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {(Object.keys(PLATFORM_CONFIG) as Platform[]).map((p) => {
          const count = state.importedPosts.filter((post) => post.platform === p).length;
          const active = p === activePlatform;
          return (
            <button
              key={p}
              onClick={() => setActivePlatform(p)}
              className={[
                "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium border transition-all cursor-pointer",
                active
                  ? "border-accent/40 bg-accent-soft text-accent-2"
                  : "border-border bg-surface text-muted hover:text-foreground hover:border-border",
              ].join(" ")}
            >
              {<PlatformIcon platform={p} />}
              {PLATFORM_CONFIG[p].label}
              {count > 0 && (
                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-success/20 text-success text-[10px] font-bold">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left: Input area */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted">
              Paste posts from {PLATFORM_CONFIG[activePlatform].label} ({limit} char limit per post)
            </p>
            <Button variant="ghost" size="sm" icon={<Plus size={13} />} onClick={addDraft}>
              Add post
            </Button>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {activeDrafts.map((draft, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <Textarea
                    value={draft}
                    onChange={(e) => updateDraft(idx, e.target.value)}
                    placeholder={PLATFORM_EXAMPLE[activePlatform]}
                    rows={6}
                    charCount={draft.length}
                    charLimit={limit}
                    className="pr-8"
                  />
                  {activeDrafts.length > 1 && (
                    <button
                      onClick={() => removeDraft(idx)}
                      className="absolute top-2.5 right-2.5 text-muted hover:text-danger transition-colors cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={handleSave} icon={<Upload size={14} />} className="flex-1">
              Save {activeDrafts.filter((d) => d.trim().length >= 20).length > 0
                ? `${activeDrafts.filter((d) => d.trim().length >= 20).length} post${activeDrafts.filter((d) => d.trim().length >= 20).length > 1 ? "s" : ""}`
                : "posts"}
            </Button>
          </div>
        </div>

        {/* Right: Saved posts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium text-muted">
              Saved {PLATFORM_CONFIG[activePlatform].label} posts ({platformPosts.length})
            </p>
            {platformPosts.length > 0 && (
              <button onClick={handleClearPlatform} className="text-[11px] text-danger hover:text-danger/80 transition-colors cursor-pointer">
                Clear all
              </button>
            )}
          </div>

          {platformPosts.length === 0 ? (
            <div className="rounded-2xl border border-border bg-surface h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface-2 border border-border flex items-center justify-center text-muted">
                {<PlatformIcon platform={activePlatform} />}
              </div>
              <p className="text-sm text-muted">No posts imported yet</p>
              <p className="text-xs text-muted/60 text-center max-w-40">Paste your past posts on the left and save them here</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              <AnimatePresence>
                {platformPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl border border-border bg-surface p-3.5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default" className="text-[10px]">
                        {<PlatformIcon platform={post.platform} />}
                        {PLATFORM_CONFIG[post.platform].label}
                      </Badge>
                      <span className="text-[10px] text-muted">{post.content.length} chars</span>
                    </div>
                    <p className="text-xs text-muted leading-relaxed line-clamp-4">{post.content}</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      {totalImported >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 rounded-2xl border border-accent/30 bg-accent-soft p-5 flex items-center justify-between gap-4"
        >
          <div>
            <p className="text-sm font-semibold text-accent-2">
              {totalImported} posts imported across {new Set(state.importedPosts.map((p) => p.platform)).size} platform{new Set(state.importedPosts.map((p) => p.platform)).size > 1 ? "s" : ""}
            </p>
            <p className="text-xs text-muted mt-0.5">Ready to analyze your voice and generate your content calendar.</p>
          </div>
          <Link href="/app/voice">
            <Button>
              Analyze my voice
              <ArrowRight size={14} />
            </Button>
          </Link>
        </motion.div>
      )}
    </div>
  );
}
