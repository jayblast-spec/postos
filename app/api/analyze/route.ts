import { NextRequest, NextResponse } from "next/server";
import type { VoiceProfile, Platform } from "../../../lib/types";

export const maxDuration = 30;

const DEMO_PROFILES: Record<Platform, VoiceProfile> = {
  linkedin: {
    platform: "linkedin",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["authoritative", "forward-thinking", "entrepreneurial", "direct"],
    energyLevel: "high",
    framingStyle: "Challenges conventional wisdom, then offers a strategic alternative",
    topics: ["AI strategy", "founder mindset", "future of work", "digital infrastructure"],
    signaturePhrases: ["The future of...", "Here's what most people miss:", "This is what it actually means"],
    hashtagStrategy: "3-5 targeted industry hashtags at the end, never mid-copy",
    hookPatterns: ["Bold claim opener", "Contrarian take + pivot", "Question that reframes the topic"],
    writingStyle: "Short punchy sentences. Strategic paragraph breaks. Numbered insights when listing.",
    audiencePositioning: "Peer-to-peer with founders and executives, not teaching down",
    postCount: 0,
  },
  twitter: {
    platform: "twitter",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["punchy", "provocative", "witty"],
    energyLevel: "electric",
    framingStyle: "Hot take followed by a twist",
    topics: ["AI", "startups", "building in public"],
    signaturePhrases: ["The founders who...", "Most people won't see this"],
    hashtagStrategy: "2-3 hashtags, sometimes inline",
    hookPatterns: ["Contrarian opener", "Prediction"],
    writingStyle: "Ultra-concise. Single ideas. Occasional metaphor.",
    audiencePositioning: "Equal with peers, occasionally provocative",
    postCount: 0,
  },
  instagram: {
    platform: "instagram",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["inspirational", "personal", "visual"],
    energyLevel: "medium",
    framingStyle: "Personal story → universal lesson",
    topics: ["founder life", "creativity", "personal growth"],
    signaturePhrases: ["Build the future", "Every day is a chance"],
    hashtagStrategy: "10-15 hashtags in first comment or end of caption",
    hookPatterns: ["Personal revelation", "Question to audience"],
    writingStyle: "Storytelling first. Emoji used strategically. Line breaks for breathing room.",
    audiencePositioning: "Authentic peer, relatable journey",
    postCount: 0,
  },
  facebook: {
    platform: "facebook",
    analyzedAt: new Date().toISOString(),
    toneDescriptors: ["conversational", "reflective", "warm"],
    energyLevel: "medium",
    framingStyle: "Observation → Reflection → Invitation to engage",
    topics: ["mindset", "entrepreneurship", "community"],
    signaturePhrases: ["Something I've been thinking about", "Most people wait for"],
    hashtagStrategy: "1-3 hashtags, very minimal",
    hookPatterns: ["Personal observation", "Common experience"],
    writingStyle: "Longer paragraphs. Conversational tone. Ends with a question or call to reflect.",
    audiencePositioning: "Community leader, accessible and genuine",
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

  const systemPrompt = `You are a social media voice analyst. Analyze the user's posts and extract their precise voice profile.
Return ONLY valid JSON with this exact structure, no markdown, no explanation:
{
  "toneDescriptors": ["string", "string", "string", "string"],
  "energyLevel": "low" | "medium" | "high" | "electric",
  "framingStyle": "string",
  "topics": ["string", "string", "string"],
  "signaturePhrases": ["string", "string"],
  "hashtagStrategy": "string",
  "hookPatterns": ["string", "string", "string"],
  "writingStyle": "string",
  "audiencePositioning": "string"
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
      max_tokens: 800,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Platform: ${platform}\n\nPosts to analyze:\n\n${combined}` },
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
