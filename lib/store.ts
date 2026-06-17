"use client";

import { useState, useEffect, useCallback } from "react";
import type { PostOSState, ImportedPost, VoiceProfile, Campaign, GeneratedPost, Platform } from "./types";

const STORAGE_KEY = "postos_state";

const DEFAULT_STATE: PostOSState = {
  importedPosts: [],
  voiceProfiles: {},
  campaigns: [],
  generatedPosts: [],
  lastUpdated: new Date().toISOString(),
};

function loadState(): PostOSState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return JSON.parse(raw) as PostOSState;
  } catch {
    return DEFAULT_STATE;
  }
}

function saveState(state: PostOSState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // storage full — silent
  }
}

export function usePostOSStore() {
  const [state, setStateRaw] = useState<PostOSState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setStateRaw(loadState());
    setHydrated(true);
  }, []);

  const setState = useCallback((updater: (prev: PostOSState) => PostOSState) => {
    setStateRaw((prev) => {
      const next = updater(prev);
      const withTimestamp = { ...next, lastUpdated: new Date().toISOString() };
      saveState(withTimestamp);
      return withTimestamp;
    });
  }, []);

  const addPosts = useCallback((posts: Omit<ImportedPost, "id" | "addedAt">[]) => {
    setState((prev) => ({
      ...prev,
      importedPosts: [
        ...prev.importedPosts,
        ...posts.map((p) => ({
          ...p,
          id: crypto.randomUUID(),
          addedAt: new Date().toISOString(),
        })),
      ],
    }));
  }, [setState]);

  const removePlatformPosts = useCallback((platform: Platform) => {
    setState((prev) => ({
      ...prev,
      importedPosts: prev.importedPosts.filter((p) => p.platform !== platform),
    }));
  }, [setState]);

  const setVoiceProfile = useCallback((profile: VoiceProfile) => {
    setState((prev) => ({
      ...prev,
      voiceProfiles: { ...prev.voiceProfiles, [profile.platform]: profile },
    }));
  }, [setState]);

  const addCampaign = useCallback((campaign: Omit<Campaign, "id" | "createdAt">, posts: Omit<GeneratedPost, "id" | "campaignId" | "copied" | "createdAt">[]) => {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      campaigns: [...prev.campaigns, { ...campaign, id, createdAt }],
      generatedPosts: [
        ...prev.generatedPosts,
        ...posts.map((p) => ({
          ...p,
          id: crypto.randomUUID(),
          campaignId: id,
          copied: false,
          createdAt,
        })),
      ],
    }));
    return id;
  }, [setState]);

  const markCopied = useCallback((postId: string) => {
    setState((prev) => ({
      ...prev,
      generatedPosts: prev.generatedPosts.map((p) =>
        p.id === postId ? { ...p, copied: true } : p
      ),
    }));
  }, [setState]);

  const clearAll = useCallback(() => {
    const fresh = { ...DEFAULT_STATE, lastUpdated: new Date().toISOString() };
    saveState(fresh);
    setStateRaw(fresh);
  }, []);

  return {
    state,
    hydrated,
    addPosts,
    removePlatformPosts,
    setVoiceProfile,
    addCampaign,
    markCopied,
    clearAll,
  };
}
