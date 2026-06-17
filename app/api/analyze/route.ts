import { NextRequest, NextResponse } from "next/server";
import type { VoiceProfile, Platform } from "../../../lib/types";

export const maxDuration = 30;

const DEMO_PROFILES: Record<Platform, VoiceProfile> = {
  linkedin: {
    platform: "linkedin",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["strategic", "thought-leadership", "systems-thinking", "executive-grade"],
    energyLevel: "high",
    framingStyle: "Names a concept → explains why it replaces the old model → breaks down by role (CEO/CHRO/CTO) → names emerging roles → closes with a sharp thesis statement",
    topics: ["AI workforce architecture", "organizational redesign", "leadership strategy", "future of work", "digital transformation"],
    signaturePhrases: ["AI isn't just a new tool", "the new foundation", "Because in the age of volatility", "the only path to inevitability", "This is the new frontier"],
    hashtagStrategy: "8–12 hashtags at the end using the format: hashtag#Word — all on one line, space-separated",
    hookPatterns: ["Emoji + concept name as a bold title opener", "Reframe the dominant assumption (X isn't Y, it is Z)", "Bold declarative thesis as section opener"],
    writingStyle: "Long-form strategic thought leadership. Emoji section dividers (🧭 🧠 🌍). Subheadings with context. Short punchy statements contrast with longer analytical paragraphs. Role-specific breakdowns. Lists use em-dashes or bullet logic. Closes with a single-line philosophical thesis.",
    audiencePositioning: "Peer conversation with C-suite, CHROs, and senior strategists — not instructing, positioning as a fellow systems thinker",
    postCount: 0,
  },
  twitter: {
    platform: "twitter",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["punchy", "provocative", "systems-thinker", "contrarian"],
    energyLevel: "electric",
    framingStyle: "Single bold reframe. One insight stripped to its sharpest form.",
    topics: ["AI strategy", "leadership", "future of work", "startups"],
    signaturePhrases: ["The real question is", "Most miss this:", "This is the shift"],
    hashtagStrategy: "2–4 hashtags inline or at end using hashtag#Word format",
    hookPatterns: ["Contrarian one-liner", "Reframe in under 10 words", "Hot take + sharp pivot"],
    writingStyle: "Ultra-concise. Every word earns its place. Occasional paradox or metaphor for punch.",
    audiencePositioning: "Equal with peers, occasionally ahead of the curve",
    postCount: 0,
  },
  instagram: {
    platform: "instagram",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["visionary", "personal", "inspirational", "strategic"],
    energyLevel: "high",
    framingStyle: "Concept title → personal perspective → why it matters now → call to think differently",
    topics: ["AI", "founder journey", "future", "leadership", "systems"],
    signaturePhrases: ["Build the future", "The shift is already here", "This is what it looks like"],
    hashtagStrategy: "10–15 hashtags at end using hashtag#Word format on a new line",
    hookPatterns: ["Bold concept title as opener", "Rhetorical question", "Vivid future-state opening"],
    writingStyle: "Structured but visual. Line breaks for breathing room. Mixes analytical insight with human narrative.",
    audiencePositioning: "Inspiring emerging leaders and founders",
    postCount: 0,
  },
  facebook: {
    platform: "facebook",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["conversational", "strategic", "accessible", "warm authority"],
    energyLevel: "medium",
    framingStyle: "Observation about what most people get wrong → the real framework → why this matters now → invite reflection",
    topics: ["AI", "leadership", "business strategy", "workforce"],
    signaturePhrases: ["Here's what most are missing:", "The real shift is", "This is worth sitting with"],
    hashtagStrategy: "3–5 hashtags at end using hashtag#Word format",
    hookPatterns: ["Open with a grounded observation", "Contrast old model vs new model", "End with a question"],
    writingStyle: "Long-form but conversational. Paragraphs feel like spoken thought. Accessible to non-technical leaders.",
    audiencePositioning: "Community leader sharing earned insight, not lecturing",
    postCount: 0,
  },
};

export async function POST(req: NextRequest) {
  const { posts, platform } = await req.json() as { posts: string[]; platform: Platform };

  if (!process.env.GROQ_API_KEY) {
    await new Promise((r) => setTimeout(r, 1800));
    const demo = { ...DEMO_PROFILES[platform], postCount: posts.length };
    return NextResponse.json({ profile: demo, demo: true });
  }

  const combined = posts.map((p, i) => `POST ${i + 1}:\n${p}`).join("\n\n---\n\n");

  const systemPrompt = `You are a deep voice analyst. Study these ${platform} posts and extract a precise DNA-level profile of how this person writes.

Go beyond surface-level tone. Identify:
- Their structural post anatomy (how they open, develop, and close)
- Rhetorical devices they use (paradox, reframe, contrast, bold claim)
- Whether they use section headers / emoji dividers
- Exactly how they format hashtags (hashtag#Word or #Word, inline or end, how many)
- Their intellectual positioning (peer-to-peer, thought leader, teacher, strategist)
- Specific sentence patterns and signature constructions
- The depth and complexity of their arguments

Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "toneDescriptors": ["4 precise descriptors, not generic like 'professional' — be specific"],
  "energyLevel": "low" | "medium" | "high" | "electric",
  "framingStyle": "Detailed sentence describing their exact post structure from opening to close",
  "topics": ["topic1", "topic2", "topic3", "topic4"],
  "signaturePhrases": ["exact phrase or construction they reuse", "another"],
  "hashtagStrategy": "Exact description of their hashtag count, format (hashtag#Word or #Word), placement, and selection logic",
  "hookPatterns": ["specific hook type they use", "another", "another"],
  "writingStyle": "Detailed description of their sentence structure, paragraph rhythm, use of lists, line breaks, emoji, formatting patterns",
  "audiencePositioning": "How they position themselves relative to their reader — tone of authority, peer dynamic, etc."
}`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 1000,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Platform: ${platform}\n\nAnalyze these posts:\n\n${combined}` },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Groq error" }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "{}";
  const match = raw.match(/\{[\s\S]*\}/);

  let parsed: Omit<VoiceProfile, "platform" | "analyzedAt" | "postCount">;
  try {
    parsed = JSON.parse(match ? match[0] : raw);
  } catch {
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }

  const profile: VoiceProfile = {
    ...parsed,
    platform,
    analyzedAt: new Date().toISOString(),
    postCount: posts.length,
  };

  return NextResponse.json({ profile, demo: false });
}
