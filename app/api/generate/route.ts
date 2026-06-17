import { NextRequest, NextResponse } from "next/server";
import type { VoiceProfile, Platform } from "../../../lib/types";
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

  // Demo posts that match the structural depth of the user's actual writing style
  const demoPosts = [
    {
      hook: "🧭 Rethink the Stack\nMost organizations are adding AI tools. The ones that will dominate are redesigning the entire system around AI.",
      body: `Why Tool Adoption Will Never Produce the Results You're Expecting

There's a fundamental misalignment happening inside most enterprise AI rollouts right now.

Leaders are measuring AI success by the number of tools deployed. The real measure is the depth of workflow redesign.

🧠 What the Data Actually Shows

Tool adoption without process redesign produces, on average, less than 8% productivity lift. Structural AI integration — where roles, decision rights, and workflows are rebuilt — produces 25–40%.

The difference isn't the technology. It's the architecture.

🌍 What This Means for Leaders

CEOs must stop treating AI as an efficiency budget line and start treating it as a structural redesign mandate.

CHROs are no longer managing job descriptions. They're designing human-AI collaboration frameworks.

CIOs are no longer deploying software. They're building the operating layer of the future organization.

The old playbook says: buy tools, train people, measure adoption.
The new mandate says: redesign the work, redefine the roles, rebuild the metrics.

Because tool adoption is a purchase. Architectural integration is a transformation.

${profile.hashtagStrategy.includes("hashtag#") ? "hashtag#AIStrategy hashtag#WorkforceRedesign hashtag#OrganizationalDesign hashtag#FutureOfWork hashtag#LeadershipByDesign hashtag#DigitalTransformation" : "#AIStrategy #WorkforceRedesign #OrganizationalDesign #FutureOfWork #LeadershipByDesign"}`,
    },
    {
      hook: "🧭 The Governance Gap\nEvery organization racing to deploy AI is accumulating invisible risk. Most won't see it until it's a headline.",
      body: `AI Governance Is Not a Legal Problem. It Is a Leadership Problem.

The instinct is to hand AI governance to compliance teams and general counsel. That instinct will get organizations in trouble.

Because the real governance gap isn't in the policy documents. It's in the decision-making culture.

🧠 Where the Risk Actually Lives

Bias accumulates in data pipelines that no single team owns.
Accountability dissolves at the boundary between human decision and AI recommendation.
Ethics erodes not through malice but through the quiet normalization of automated outputs.

🌍 The Roles That Must Exist

AI Governance & Ethics Officer: Not a compliance function — a strategic architecture role that sits at the leadership table.

Human-in-the-Loop Manager: Defines exactly where human judgment must override AI outputs, and owns those escalation protocols.

AI Literacy Enablement Lead: Ensures every leader in the organization can interrogate an AI recommendation, not just accept it.

These aren't future roles. They are current gaps producing current risk.

The organizations that build this governance architecture now will not just survive regulatory scrutiny. They will own the trust premium that comes with it.

Because in AI, trust is the only moat that compounds.

${profile.hashtagStrategy.includes("hashtag#") ? "hashtag#AIGovernance hashtag#ResponsibleAI hashtag#LeadershipStrategy hashtag#FutureOfWork hashtag#EthicsInAI hashtag#DigitalTransformation hashtag#ArkNetThinking" : "#AIGovernance #ResponsibleAI #LeadershipStrategy #FutureOfWork #EthicsInAI"}`,
    },
    {
      hook: "🧭 The Literacy Mandate\nAI literacy is no longer a technical skill. It is a leadership competency. And most leadership teams are failing this test right now.",
      body: `Why Non-Technical Leaders Must Now Understand AI — And What Understanding Actually Means

There's a dangerous assumption embedded in most AI training programs: that non-technical leaders only need to know enough to ask the right questions.

That assumption is a ceiling.

🧠 The Actual Competency Required

Leaders don't need to build models. They need to interrogate them.

The difference matters enormously.

Interrogating an AI system means understanding what data it was trained on, where it hallucinates, when its confidence should not be trusted, and what the failure modes look like in production.

Without that, every strategic decision made on AI-generated insight is a decision made on unverified intelligence.

🌍 What AI-Literate Leadership Looks Like

CEOs who can read an AI output and identify the assumptions baked into it.
CHROs who can distinguish between AI-assisted performance data and AI-generated narrative.
CIOs who can communicate AI limitations to boards and investors without losing credibility.
CTOs who can align technical architecture decisions with business ethics — not just business speed.

This is what separates AI-augmented organizations from AI-dependent ones.

The augmented organization uses AI as a multiplier of human judgment. The dependent one has quietly replaced judgment with automation and called it efficiency.

Because literacy isn't about knowing the tools. It's about knowing what the tools cannot see.

${profile.hashtagStrategy.includes("hashtag#") ? "hashtag#AILiteracy hashtag#LeadershipDevelopment hashtag#FutureOfWork hashtag#SystemLeadership hashtag#ArkNetThinking hashtag#GenerativeAI hashtag#ExecutiveEducation" : "#AILiteracy #LeadershipDevelopment #FutureOfWork #SystemLeadership #GenerativeAI"}`,
    },
    {
      hook: "🧭 Decouple Growth from Headcount\nThe most consequential strategic shift available to leaders in 2026 is also the least discussed: AI-enabled growth without proportional headcount expansion.",
      body: `Why Headcount and Growth Are No Longer Correlated — And What to Do About It

For decades, scaling meant hiring. Revenue growth had a predictable shadow: headcount growth.

That correlation is breaking.

🧠 The New Math

An AI-augmented role can absorb 40–60% more scope without a corresponding increase in cognitive load — when the augmentation is designed correctly.

The critical phrase: when designed correctly.

Most AI augmentation isn't designed. It's layered. Tools get added on top of existing job structures. The cognitive load increases. Productivity stalls. Leaders blame the tools.

The real failure is the absence of architecture.

🌍 What Redesigned Looks Like

Job structures rebuilt around the collaboration between human judgment and machine execution — not human execution supplemented by machine suggestions.

Decision rights clarified at every step: What does the human decide? What does the AI recommend? Where is the override protocol?

Measurement systems redesigned: Not inputs and hours, but outcomes and judgment quality.

This is how organizations achieve scalable efficiency without relying on layoffs. Not by removing people, but by redesigning what people do — so that fewer people can steward dramatically more complexity.

Growth decouples from headcount not through austerity but through augmentation architecture.

Because the most powerful competitive advantage in 2026 is not the AI you've deployed. It's the organizational design you've built around it.

${profile.hashtagStrategy.includes("hashtag#") ? "hashtag#WorkforceArchitecture hashtag#AIAugmentation hashtag#OrganizationalDesign hashtag#ScalableGrowth hashtag#FutureOfWork hashtag#BusinessStrategy hashtag#ArkNetThinking hashtag#LeadershipByDesign" : "#WorkforceArchitecture #AIAugmentation #OrganizationalDesign #ScalableGrowth #FutureOfWork #BusinessStrategy"}`,
    },
  ];

  for (let w = 1; w <= weeks; w++) {
    for (let d = 0; d < 4; d++) {
      const idx = ((w - 1) * 4 + d) % demoPosts.length;
      const post = demoPosts[idx];
      const fullContent = `${post.hook}\n\n${post.body}`;
      posts.push({
        week: w,
        day: DAYS[d],
        hook: post.hook.split("\n")[0],
        content: fullContent.slice(0, limit),
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

  const systemPrompt = `You are a world-class ghostwriter specializing in executive thought leadership on ${platform}.

Your task: generate ${totalPosts} posts that are INDISTINGUISHABLE from the person's own writing. Not similar. Indistinguishable.

VOICE DNA:
- Tone: ${voiceProfile.toneDescriptors.join(", ")}
- Energy: ${voiceProfile.energyLevel}
- Post structure: ${voiceProfile.framingStyle}
- Core topics: ${voiceProfile.topics.join(", ")}
- Signature phrases (use sparingly, only when they fit naturally): ${voiceProfile.signaturePhrases.join(" | ")}
- Hashtag format: ${voiceProfile.hashtagStrategy}
- Hook patterns: ${voiceProfile.hookPatterns.join(" | ")}
- Writing style: ${voiceProfile.writingStyle}
- Audience positioning: ${voiceProfile.audiencePositioning}

QUALITY STANDARDS — every post must:
1. Open with the exact hook structure they use (study their hook patterns above)
2. Follow their structural anatomy precisely — section headers if they use them, emoji dividers if they use them
3. Develop a REAL strategic argument — not generic AI advice, a specific insight with frameworks, examples, or role breakdowns
4. Match their intellectual depth — if they write at executive/C-suite level, every sentence must earn that positioning
5. End with their closing style — sharp thesis, philosophical statement, or call to rethink
6. Use hashtags in EXACTLY their documented format (count, format style hashtag#Word or #Word, placement)
7. Be ${limit} characters maximum — write to fill the limit, not truncate at it

CRITICAL: Do not produce generic AI content. Produce posts that would embarrass GPT-4 to compare against. Every post must have a UNIQUE strategic insight — not rephrasing of the same idea.

Return ONLY valid JSON, no markdown:
{
  "posts": [
    {
      "week": 1,
      "day": "Monday",
      "hook": "first line only",
      "content": "complete full-length post"
    }
  ]
}

Weeks 1–${durationWeeks}, days: Monday, Tuesday, Thursday, Friday. ${totalPosts} total posts.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.75,
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate ${totalPosts} ${platform} posts (${durationWeeks} week${durationWeeks > 1 ? "s" : ""}) in this person's exact voice. Each post must be a distinct strategic insight — not variations of the same theme. Platform character limit: ${limit} chars per post.`,
        },
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
