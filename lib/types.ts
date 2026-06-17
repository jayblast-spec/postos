export type Platform = "linkedin" | "twitter" | "instagram" | "facebook";

export type ImportedPost = {
  id: string;
  platform: Platform;
  content: string;
  addedAt: string;
};

export type VoiceProfile = {
  platform: Platform;
  analyzedAt: string;
  toneDescriptors: string[];
  energyLevel: "low" | "medium" | "high" | "electric";
  framingStyle: string;
  topics: string[];
  signaturePhrases: string[];
  hashtagStrategy: string;
  hookPatterns: string[];
  writingStyle: string;
  audiencePositioning: string;
  postCount: number;
};

export type GeneratedPost = {
  id: string;
  campaignId: string;
  platform: Platform;
  content: string;
  week: number;
  day: "Monday" | "Tuesday" | "Thursday" | "Friday";
  hook: string;
  copied: boolean;
  createdAt: string;
};

export type Campaign = {
  id: string;
  platform: Platform;
  durationWeeks: 1 | 2 | 3;
  createdAt: string;
  postCount: number;
};

export type PostOSState = {
  importedPosts: ImportedPost[];
  voiceProfiles: Partial<Record<Platform, VoiceProfile>>;
  campaigns: Campaign[];
  generatedPosts: GeneratedPost[];
  lastUpdated: string;
};

export const PLATFORM_CONFIG: Record<Platform, {
  label: string;
  color: string;
  charLimit: number;
  bgClass: string;
  textClass: string;
}> = {
  linkedin: {
    label: "LinkedIn",
    color: "#0077b5",
    charLimit: 3000,
    bgClass: "bg-[#0077b5]",
    textClass: "text-[#0077b5]",
  },
  twitter: {
    label: "X (Twitter)",
    color: "#1d9bf0",
    charLimit: 280,
    bgClass: "bg-[#1d9bf0]",
    textClass: "text-[#1d9bf0]",
  },
  instagram: {
    label: "Instagram",
    color: "#e1306c",
    charLimit: 2200,
    bgClass: "bg-[#e1306c]",
    textClass: "text-[#e1306c]",
  },
  facebook: {
    label: "Facebook",
    color: "#1877f2",
    charLimit: 2500,
    bgClass: "bg-[#1877f2]",
    textClass: "text-[#1877f2]",
  },
};
