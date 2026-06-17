import { NextRequest, NextResponse } from "next/server";
import type { VoiceProfile, Platform, GeneratedPost } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

export const maxDuration = 30;

type WeekPost = {
  week: number;
  day: "Monday" | "Tuesday" | "Thursday" | "Friday";
  hook: string;
  content: string;
};

const DAYS: Array<"Monday" | "Tuesday" | "Thursday" | "Friday"> = ["Monday", "Tuesday", "Thursday", "Friday"];

function buildDemoContent(profile: VoiceProfile, platform: Platform, weeks: number): WeekPost[] {
  const limit = PLATFORM_CONFIG[platform].charLimit;
  const posts: WeekPost[] = [];

  const demoHooks = [
    `Most ${profile.topics[0] ?? "founders"} get this completely wrong.`,
    `Here's what ${profile.topics[1] ?? "the data"} actually shows us.`,
    `The ${profile.topics[0] ?? "industry"} is changing faster than anyone expected.`,
    `I've been thinking about ${profile.topics[2] ?? "this"} for weeks, and here's what I found.`,
  ];

  const demoBodies = [
    `${profile.framingStyle}. When you understand this, everything changes.\n\nMost people are still operating on old assumptions. But the landscape has shifted dramatically.\n\nHere's what the data actually shows:\n\n1. The first thing to understand is how the market is evolving\n2. Your positioning matters more than your product features\n3. The founders who adapt fastest will capture disproportionate value\n\nThe opportunity is enormous — but only for those who move now.`,
    `Let me break down exactly how this works in practice.\n\nThe conventional wisdom says one thing. The evidence says another.\n\nAfter working with dozens of founders, the pattern is clear:\n\n→ Those who focus on fundamentals win long-term\n→ Tactical shortcuts create short-term gains but long-term fragility\n→ The best operators are obsessively focused on one thing\n\nThis is what separates the builders from the dreamers.`,
  ];

  for (let w = 1; w <= weeks; w++) {
    for (let d = 0; d < 4; d++) {
      const hookIdx = (w * 4 + d) % demoHooks.length;
      const bodyIdx = (w + d) % demoBodies.length;
      const hashtags = `\n\n${["#AI", "#Founders", "#Startups", "#FutureOfWork", "#BuildInPublic"].slice(0, 3).join(" ")}`;
      const content = `${demoHooks[hookIdx]}\n\n${demoBodies[bodyIdx]}${hashtags}`;
      posts.push({
        week: w,
        day: DAYS[d],
        hook: demoHooks[hookIdx],
        content: content.slice(0, limit),
      });
    }
  }
  return posts;
}

export async function POST(req: NextRequest) {
  const { voiceProfile, platform, durationWeeks } = await req.json() as {
    voiceProfile: VoiceProfile;
    platform: Platform;
    durationWeeks: 1 | 2 | 3;
  };

  if (!process.env.GROQ_API_KEY) {
    await new Promise((r) => setTimeout(r, 2000));
    const posts = buildDemoContent(voiceProfile, platform, durationWeeks);
    return NextResponse.json({ posts, demo: true });
  }

  const limit = PLATFORM_CONFIG[platform].charLimit;
  const totalPosts = durationWeeks * 4;

  const systemPrompt = `You are an expert social media ghostwriter. Generate ${totalPosts} posts for ${platform} in the exact voice described below.
Each post must be authentically in their voice — not generic AI content.

Voice Profile:
- Tone: ${voiceProfile.toneDescriptors.join(", ")}
- Energy: ${voiceProfile.energyLevel}
- Framing style: ${voiceProfile.framingStyle}
- Core topics: ${voiceProfile.topics.join(", ")}
- Signature phrases (use sparingly, naturally): ${voiceProfile.signaturePhrases.join(", ")}
- Hashtag strategy: ${voiceProfile.hashtagStrategy}
- Hook patterns: ${voiceProfile.hookPatterns.join(", ")}
- Writing style: ${voiceProfile.writingStyle}
- Audience positioning: ${voiceProfile.audiencePositioning}

Rules:
- Maximum ${limit} characters per post
- Full-length posts — no truncation
- Each post must start with a strong hook
- Follow the hashtag strategy exactly
- Vary topics across posts — no repetition
- Sound like a real human, not AI

Return ONLY valid JSON, no markdown, no explanation:
{
  "posts": [
    {
      "week": 1,
      "day": "Monday",
      "hook": "first line of the post",
      "content": "full post content including hashtags"
    }
  ]
}

Generate posts for weeks 1 to ${durationWeeks}, days: Monday, Tuesday, Thursday, Friday (4 posts per week = ${totalPosts} total).`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.8,
      max_tokens: 4096,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Generate ${totalPosts} ${platform} posts in ${durationWeeks} week${durationWeeks > 1 ? "s" : ""}.` },
      ],
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Groq error" }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "{}";
  const match = raw.match(/\{[\s\S]*\}/);

  let parsed: { posts: WeekPost[] };
  try {
    parsed = JSON.parse(match ? match[0] : raw);
  } catch {
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }

  return NextResponse.json({ posts: parsed.posts ?? [], demo: false });
}
