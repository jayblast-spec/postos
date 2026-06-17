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

const DAYS: Array<"Monday" | "Tuesday" | "Thursday" | "Friday"> = [
  "Monday",
  "Tuesday",
  "Thursday",
  "Friday",
];

// ---------- PLATFORM-SPECIFIC STRUCTURE TEMPLATES ----------

const LINKEDIN_TEMPLATE = `
MANDATORY STRUCTURE — every LinkedIn post must follow this EXACT skeleton (do not deviate):

[emoji] [Bold Concept Title — 3–6 words]
[1–2 sentence strategic subtitle that names the shift and why it matters now]

[Full subheading sentence: "Why [Old Model] Must Be Replaced by [New Model]"]

[Paragraph 1 — 3–4 sentences: open with the dominant assumption most people hold, then challenge it with a specific insight]

[Paragraph 2 — 2–3 sentences: deepen the argument with a specific mechanism, data point, or structural observation]

[Bold reframe line — standalone, short: "X isn't just Y."]
[Contrasting resolution — standalone, short: "It is the Z."]

🧠 Why This Matters

[3–4 bolded strategic points, each formatted as: Bold phrase. Full explanatory sentence that is specific and non-generic.]

🌍 Strategic Implications for Leaders

[Opening sentence introducing the section]

CEOs [specific implication — 1–2 sentences]

CHROs [specific implication — 1–2 sentences]

CIOs and CTOs [specific implication — 1–2 sentences]

Employees [specific implication — 1–2 sentences]

The lesson is clear: [X is one thing]. [Y is a different, more important thing].

🧭 New Roles Emerging in [Topic Area]

[Role Title 1]: [1-sentence description of what this role does and why it exists now]

[Role Title 2]: [1-sentence description]

[Role Title 3]: [1-sentence description]

[Role Title 4]: [1-sentence description]

[2–3 sentence closing that elevates the argument to its strategic conclusion]

Because in the age of [relevant context], [X] is the only path to [Y].

hashtag#Tag1 hashtag#Tag2 hashtag#Tag3 hashtag#Tag4 hashtag#Tag5 hashtag#Tag6 hashtag#Tag7 hashtag#Tag8 hashtag#Tag9 hashtag#Tag10
`;

const TWITTER_TEMPLATE = `
MANDATORY STRUCTURE — X/Twitter post:

[1 bold contrarian claim or provocative reframe — 1 sentence max, under 80 characters]

[1–2 sentences that either explain the paradox or give the pivot insight]

[Optional: 1 bullet list of 2–3 items if needed]

[Closing 1-liner that lands the idea]

hashtag#Tag1 hashtag#Tag2 hashtag#Tag3

Keep entire post under 280 characters including hashtags.
`;

const INSTAGRAM_TEMPLATE = `
MANDATORY STRUCTURE — Instagram post:

[emoji] [Concept Title]
[1 bold sentence that hooks]

[2–3 paragraphs of strategic insight, broken with line spaces]

[Why this matters NOW — 2 sentences]

[Closing statement — 1 punchy line]

hashtag#Tag1 hashtag#Tag2 hashtag#Tag3 hashtag#Tag4 hashtag#Tag5 hashtag#Tag6 hashtag#Tag7 hashtag#Tag8 hashtag#Tag9 hashtag#Tag10

Total length: 1,500–2,200 characters
`;

const FACEBOOK_TEMPLATE = `
MANDATORY STRUCTURE — Facebook post:

[Opening observation — 2 sentences grounding the reader in a real situation or common mistake]

[Section: "Here's what most are missing:"]

[3–4 paragraph strategic argument, each paragraph separated by line break]

[Role-specific implications — 2–3 key ones relevant to the audience]

[Closing thought — 1–2 sentences, conversational, ends with a question or invitation to reflect]

hashtag#Tag1 hashtag#Tag2 hashtag#Tag3 hashtag#Tag4 hashtag#Tag5

Total length: 1,200–2,500 characters
`;

const TEMPLATES: Record<Platform, string> = {
  linkedin: LINKEDIN_TEMPLATE,
  twitter: TWITTER_TEMPLATE,
  instagram: INSTAGRAM_TEMPLATE,
  facebook: FACEBOOK_TEMPLATE,
};

// ---------- DEMO FALLBACK CONTENT (matches real structural depth) ----------

const DEMO_LINKEDIN_POSTS: WeekPost[] = [
  {
    week: 1,
    day: "Monday",
    hook: "🧭 Redesign the Work, Not the Toolbox",
    content: `🧭 Redesign the Work, Not the Toolbox
Most organizations are measuring AI success by the number of tools deployed. The ones that will lead in 2027 are measuring it by the depth of workflow redesign.

Why Tool Adoption Without Structural Redesign Will Always Disappoint

The instinct when AI arrives in an organization is to deploy it — to existing roles, existing processes, existing job descriptions. That instinct is understandable. It is also why most AI transformations underdeliver.

Tool adoption layered on top of legacy structure creates a predictable pattern: initial enthusiasm, rising cognitive load, stalled productivity, blame placed on the tools. The tools are not the problem. The architecture is.

AI isn't a layer you add to existing work.
It is the new structural foundation you build work around.

🧠 Why This Matters

Architecture over adoption. Organizations that redesign job structures around AI collaboration rather than simply adding AI tools see 25–40% productivity lift per role — vs. less than 8% from tool-only deployments.

Decision rights are the missing variable. Most AI rollouts never define where human judgment must override machine output. Without this, accountability dissolves at the exact moment it matters most.

Cognitive load is a design problem. When AI is layered without redesign, employees carry old workload plus new AI management overhead. When it is designed in, cognitive load drops and judgment quality rises.

The metrics are wrong. Measuring AI success by adoption rates is like measuring a renovation by the number of tools purchased. The measure is the quality of the structure that results.

🌍 Strategic Implications for Leaders

The shift from AI adoption to AI architecture changes every leadership role:

CEOs must stop treating AI transformation as a technology budget and start treating it as an organizational redesign mandate that reshapes the entire P&L.

CHROs are no longer managing static job descriptions. They are designing dynamic human-AI workflows — and overseeing the largest reskilling effort in organizational history.

CIOs and CTOs must shift from providing access to LLMs to building the integrated architecture that embeds AI into the actual flow of work, not alongside it.

Employees are moving away from repetitive execution toward higher-value roles where critical thinking, ethical judgment, and complex decision-making are the core deliverables.

The lesson is clear: AI adoption is a technology purchase. AI architecture is an organizational redesign.

🧭 New Roles Emerging in AI-Augmented Organizations

AI Job Redesign Architect: Deconstructs existing roles using performance data and rebuilds them to optimize the boundary between human judgment and machine execution.

Human-in-the-Loop (HITL) Manager: Defines and oversees the critical escalation points where human judgment must validate or override AI outputs before they affect real outcomes.

AI Governance & Ethics Compliance Officer: Ensures every augmented workflow meets established bias controls, regulatory standards, and ethical guidelines — before deployment, not after incidents.

AI Literacy Enablement Lead: Develops and mandates training that gives non-technical leadership the ability to interrogate AI outputs, not just consume them.

These roles are not future state. They represent current gaps producing current risk in organizations that have deployed AI without designing for it.

Because in the age of AI acceleration, an augmented workforce architecture is the only path to sustainable competitive advantage.

hashtag#AIAugmentation hashtag#WorkforceArchitecture hashtag#OrganizationalDesign hashtag#FutureOfWork hashtag#LeadershipByDesign hashtag#BusinessStrategy hashtag#DigitalTransformation hashtag#HumanInTheLoop hashtag#AIStrategy hashtag#SystemLeadership`,
  },
  {
    week: 1,
    day: "Tuesday",
    hook: "🧭 The Governance Gap",
    content: `🧭 The Governance Gap
Every organization racing to deploy AI is simultaneously accumulating invisible governance risk. Most will not see it until it becomes a headline.

Why AI Governance Is a Leadership Mandate, Not a Compliance Function

The first instinct is to route AI governance to legal and compliance teams. That instinct will get organizations into serious trouble — not because compliance teams are insufficient, but because the root of governance failure is never in the policy documents.

It lives in decision-making culture. In the normalization of unreviewed AI outputs. In the quiet erosion of human accountability at the boundary between machine recommendation and real-world consequence.

Governance isn't a legal wall you build around AI.
It is the leadership culture you build into it.

🧠 Why This Matters

Bias accumulates invisibly. It compounds in data pipelines that no single team owns, in models trained on historical decisions that embedded historical inequity, in outputs that look objective because a machine produced them.

Accountability dissolves at the boundary. The most dangerous governance gap is not fraud or malice — it is the grey zone where humans defer to AI outputs without assuming responsibility for them.

Ethics is a design problem, not an audit problem. You cannot retrofit ethical governance onto a deployed system. It must be designed into the architecture from the beginning.

Trust is the only AI moat that compounds. Organizations that build rigorous, visible governance now will own a trust premium that no late-mover can buy.

🌍 Strategic Implications for Leaders

Governance failure is a leadership failure. The accountability chain runs straight to the top:

CEOs must ensure that AI governance has a seat at the executive table — not as a compliance checkbox but as a strategic risk architecture function.

CHROs must design human-AI workflows that make accountability explicit: who is responsible for AI-assisted decisions, and what the override protocols are.

CIOs and CTOs must build governance infrastructure before scale — because retrofitting controls onto widely-deployed systems costs an order of magnitude more than designing them in.

Employees must be trained not just to use AI tools, but to recognize the failure modes — hallucination, bias, false confidence — and escalate appropriately.

The lesson is clear: Deploying AI without governance is not speed. It is deferred liability.

🧭 New Roles Emerging in AI Governance

AI Governance & Ethics Officer: A strategic architecture role — not a compliance function — that sits at the executive table and owns the ethical framework for all AI-assisted decisions.

Human-in-the-Loop (HITL) Manager: Defines every escalation point where human judgment must validate AI output before it affects a real outcome, and owns the culture around those checkpoints.

AI Bias Auditor: Continuously monitors model outputs for emergent bias patterns, reports findings to leadership, and mandates corrective action in the training pipeline.

AI Risk & Regulatory Compliance Lead: Tracks the evolving regulatory landscape across jurisdictions and ensures deployed AI systems remain compliant ahead of enforcement, not in response to it.

These roles are the difference between organizations that deploy AI responsibly and those that deploy it recklessly — and discover the cost later.

Because in the age of algorithmic decision-making, governance is not a constraint on innovation. It is the architecture that makes innovation sustainable.

hashtag#AIGovernance hashtag#ResponsibleAI hashtag#LeadershipStrategy hashtag#EthicsInAI hashtag#FutureOfWork hashtag#DigitalTransformation hashtag#ArkNetThinking hashtag#SystemLeadership hashtag#AIRisk hashtag#HumanInTheLoop`,
  },
  {
    week: 1,
    day: "Thursday",
    hook: "🧭 The Literacy Mandate",
    content: `🧭 The Literacy Mandate
AI literacy is no longer a technical competency. It is a leadership requirement. And most leadership teams are failing this test right now — without knowing it.

Why Non-Technical Leaders Must Now Understand AI at a Strategic Level

There is a dangerous assumption embedded in most enterprise AI training programs: that non-technical leaders only need enough understanding to ask the right questions. That assumption is well-intentioned. It is also a ceiling.

Because the leaders who will navigate this era successfully are not the ones who can prompt an AI well. They are the ones who can interrogate an AI output — identify its assumptions, recognize its failure modes, and make a judgment about when to trust it and when to override it.

AI literacy is not about knowing how to use the tools.
It is about knowing what the tools cannot see.

🧠 Why This Matters

Interrogation is different from operation. Most AI training programs produce operators: people who can use a tool. The leadership need is for interrogators: people who can evaluate an output against its underlying logic and decide whether it is trustworthy.

Hallucination is a leadership risk, not just a technical bug. When an AI system produces confident-sounding output based on incorrect data, the damage is not technical. It is strategic — a decision made on false intelligence.

Literacy closes the accountability gap. When leaders cannot evaluate AI outputs, accountability diffuses. When they can, it consolidates — in exactly the way governance requires.

Literacy enables bold deployment. Paradoxically, deeper AI understanding produces more strategic AI deployment, not more caution. You move faster when you know where the edges are.

🌍 Strategic Implications for Leaders

AI literacy changes what leadership competence looks like at every level:

CEOs must be able to read an AI-generated strategy brief and identify the assumptions baked into it — or they are making strategic decisions on unverified intelligence.

CHROs must distinguish between AI-assisted performance analysis and AI-generated narrative — because the risk of one being mistaken for the other in people decisions is significant.

CIOs and CTOs must communicate AI limitations clearly to boards, investors, and regulators — which requires depth of understanding, not fluency with demos.

Employees who develop the ability to critically evaluate and direct AI tools will be the most valuable people in their organizations within 24 months.

The lesson is clear: AI literacy is not a training program you complete. It is a leadership capability you build continuously.

🧭 New Roles Emerging in AI Literacy

AI Literacy Enablement Lead: Designs and mandates training programs that give non-technical leaders the ability to interrogate AI outputs — not just consume them.

Prompt Architecture Specialist: Translates strategic business problems into precise AI instructions, ensuring that what the organization asks of AI is coherent with what it actually needs.

AI Output Validation Manager: Owns the organizational protocols for reviewing, challenging, and approving AI-generated outputs before they influence decisions or customer-facing actions.

Human Judgment Preservation Officer: A forward-looking role that specifically protects the development of human expertise, critical thinking, and ethical reasoning in an era of increasing AI automation.

These roles represent the emerging infrastructure of organizational intelligence — the human layer that ensures AI augments judgment rather than replacing it.

Because in an age where AI can produce convincing answers to almost any question, the ability to ask the right questions — and evaluate the answers critically — is the most valuable leadership skill in existence.

hashtag#AILiteracy hashtag#LeadershipDevelopment hashtag#FutureOfWork hashtag#SystemLeadership hashtag#ArkNetThinking hashtag#GenerativeAI hashtag#ExecutiveEducation hashtag#CriticalThinking hashtag#DigitalTransformation hashtag#LeadershipByDesign`,
  },
  {
    week: 1,
    day: "Friday",
    hook: "🧭 Decouple Growth from Headcount",
    content: `🧭 Decouple Growth from Headcount
The most consequential strategic shift available to organizations in 2026 is the least discussed: achieving scalable growth without proportional headcount expansion through AI-augmented architecture.

Why the Growth-Headcount Correlation Is Breaking — and What Leaders Must Do About It

For decades, the growth model was predictable. More revenue required more people. Scaling meant hiring. The relationship was linear, and the headcount trajectory was one of the most reliable signals of organizational health.

That correlation is now structurally breaking — not because of layoffs, but because AI-augmented job design is expanding the scope of what a single human can steward without proportionally increasing cognitive load.

Growth no longer requires headcount expansion.
It requires workforce architecture that enables each person to steward more.

🧠 Why This Matters

Scope absorption, not headcount addition. An AI-augmented role designed correctly can absorb 40–60% more scope without increasing the cognitive burden on the human in that role — because the right tasks have been delegated to AI execution.

Architecture makes the difference. The organizations achieving this are not deploying more AI tools. They are redesigning the work — redefining what humans decide, what AI executes, and where the handoff is governed.

Efficiency without austerity. The narrative around AI and headcount defaults to one of two extremes: job elimination or no change. The actual opportunity sits in the middle — fewer new hires required to support the same growth, achieved through design rather than displacement.

Measurement must evolve. Organizations still measuring productivity by hours worked and tasks completed will systematically undervalue AI-augmented roles. The new metric is judgment quality and outcome quality per role.

🌍 Strategic Implications for Leaders

Decoupling growth from headcount is a strategic architecture decision, not an HR policy:

CEOs must stop measuring organizational health by headcount growth and start measuring it by output per augmented role — a fundamentally different view of organizational capacity.

CHROs must design the dynamic job architecture that makes this possible: redefining roles not as static descriptions but as living human-AI collaboration frameworks that evolve as AI capabilities evolve.

CIOs and CTOs must build the technical architecture that actually delivers on this promise — integrated AI that is embedded in the flow of work, not sitting adjacent to it as an optional add-on.

Employees who embrace augmented roles will develop the most differentiated skill set in the market: the ability to direct, govern, and quality-control AI execution at a professional level.

The lesson is clear: Headcount reduction through AI is a short-term cost strategy. Headcount decoupling through AI architecture is a long-term growth strategy.

🧭 New Roles Emerging from Augmented Architecture

AI Workforce Capacity Planner: Models the relationship between AI augmentation levels and organizational output, enabling leaders to make growth decisions based on architecture rather than headcount projections.

Role Redesign Consultant (Internal): Works with department leaders to deconstruct existing roles and rebuild them around the human-AI collaboration boundary specific to that function.

Augmentation Quality Assurance Lead: Monitors whether AI-augmented roles are delivering the intended scope expansion without increasing error rates or reducing decision quality.

Organizational AI ROI Analyst: Measures and reports the actual productivity lift from AI architecture decisions, creating the evidence base that justifies continued investment in workforce redesign.

These roles represent the operational infrastructure required to make AI-augmented growth repeatable, measurable, and sustainable across the organization.

Because in the age of AI acceleration, the competitive advantage is not the AI you have deployed. It is the organizational architecture you have built to deploy it with precision.

hashtag#WorkforceArchitecture hashtag#AIAugmentation hashtag#ScalableGrowth hashtag#OrganizationalDesign hashtag#FutureOfWork hashtag#LeadershipByDesign hashtag#BusinessStrategy hashtag#ArkNetThinking hashtag#DigitalTransformation hashtag#HumanInTheLoop`,
  },
];

function buildDemoContent(platform: Platform, weeks: number): WeekPost[] {
  if (platform === "linkedin") {
    const result: WeekPost[] = [];
    for (let w = 1; w <= weeks; w++) {
      for (let d = 0; d < 4; d++) {
        const src = DEMO_LINKEDIN_POSTS[(w - 1) * 4 + d] ?? DEMO_LINKEDIN_POSTS[d % DEMO_LINKEDIN_POSTS.length];
        result.push({ ...src, week: w, day: DAYS[d] });
      }
    }
    return result;
  }

  // For other platforms, generate appropriately shorter content
  const limit = PLATFORM_CONFIG[platform].charLimit;
  const posts: WeekPost[] = [];
  const topics = ["AI strategy", "workforce design", "leadership literacy", "organizational architecture"];
  for (let w = 1; w <= weeks; w++) {
    for (let d = 0; d < 4; d++) {
      const topic = topics[(w * 4 + d) % topics.length];
      const content =
        platform === "twitter"
          ? `The organizations that will win the next decade are not the ones with the most AI tools.\n\nThey are the ones who redesigned their work around AI.\n\nThat is the shift most leaders are still missing.\n\nhashtag#AIStrategy hashtag#FutureOfWork hashtag#LeadershipByDesign`
          : `🧭 The ${topic} shift is here — and most organizations are measuring the wrong thing.\n\nThe question is not how many AI tools you have deployed.\n\nThe question is: how deeply have you redesigned the work around them?\n\nOrganizations that architect AI into job design rather than layering it on top see 3-5x the productivity lift of those that do not.\n\nThis is the strategic difference between AI adoption and AI architecture.\n\nhashtag#AIStrategy hashtag#FutureOfWork hashtag#LeadershipByDesign hashtag#DigitalTransformation hashtag#ArkNetThinking`;
      posts.push({
        week: w,
        day: DAYS[d],
        hook: `The ${topic} shift is here`,
        content: content.slice(0, limit),
      });
    }
  }
  return posts;
}

// ---------- MAIN ROUTE ----------

export async function POST(req: NextRequest) {
  const { voiceProfile, platform, durationWeeks } = await req.json() as {
    voiceProfile: VoiceProfile;
    platform: Platform;
    durationWeeks: 1 | 2 | 3;
  };

  if (!process.env.GROQ_API_KEY) {
    await new Promise((r) => setTimeout(r, 2000));
    const posts = buildDemoContent(platform, durationWeeks);
    return NextResponse.json({ posts, demo: true });
  }

  const limit = PLATFORM_CONFIG[platform].charLimit;
  const totalPosts = durationWeeks * 4;
  const template = TEMPLATES[platform];

  const systemPrompt = `You are a world-class ghostwriter producing executive thought leadership content for ${platform}.

Your task: generate ${totalPosts} FULL-LENGTH posts that are indistinguishable from this person's own writing.

═══════════════════════════════════════
VOICE PROFILE
═══════════════════════════════════════
Tone: ${voiceProfile.toneDescriptors.join(", ")}
Energy: ${voiceProfile.energyLevel}
Post structure: ${voiceProfile.framingStyle}
Core topics: ${voiceProfile.topics.join(", ")}
Signature phrases (use sparingly, only when natural): ${voiceProfile.signaturePhrases.join(" | ")}
Hashtag format: ${voiceProfile.hashtagStrategy}
Hook patterns: ${voiceProfile.hookPatterns.join(" | ")}
Writing style: ${voiceProfile.writingStyle}
Audience positioning: ${voiceProfile.audiencePositioning}

═══════════════════════════════════════
MANDATORY STRUCTURE (DO NOT DEVIATE)
═══════════════════════════════════════
${template}

═══════════════════════════════════════
LENGTH REQUIREMENT — NON-NEGOTIABLE
═══════════════════════════════════════
${platform === "twitter"
      ? "Every post MUST be under 280 characters total. Count carefully."
      : `Every post MUST be between ${Math.round(limit * 0.75)} and ${limit} characters.
A post under ${Math.round(limit * 0.6)} characters is a FAILURE.
Write the full argument. Do not summarize. Do not truncate.
Fill every section of the structural template completely.`
    }

═══════════════════════════════════════
QUALITY STANDARDS
═══════════════════════════════════════
1. Every post must contain a SPECIFIC, ORIGINAL strategic insight — not a generic AI platitude.
2. Every post must follow the EXACT mandatory structure above, section by section.
3. Role-specific implications (CEOs/CHROs/CIOs/Employees) must be specific and non-interchangeable.
4. New Roles section must name real, plausible emerging roles with specific descriptions.
5. The closing statement must be a sharp philosophical thesis, not a call to action.
6. Hashtags must use EXACTLY the format documented in the voice profile.
7. Each of the ${totalPosts} posts must cover a DIFFERENT strategic topic — no repetition.

Return ONLY valid JSON, no markdown, no code fences:
{
  "posts": [
    {
      "week": 1,
      "day": "Monday",
      "hook": "first line of the post only",
      "content": "the complete full-length post including all sections and hashtags"
    }
  ]
}

Weeks 1 to ${durationWeeks}, days: Monday, Tuesday, Thursday, Friday. ${totalPosts} posts total.`;

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      temperature: 0.72,
      max_tokens: 8192,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Generate ${totalPosts} ${platform} posts across ${durationWeeks} week${durationWeeks > 1 ? "s" : ""}.

REMINDER: Each post must be ${platform === "twitter" ? "under 280 characters" : `at least ${Math.round(limit * 0.75)} characters long`}. Follow the mandatory structure exactly. Every post must be a complete, fully-developed thought leadership piece — not a summary or teaser.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Groq error:", errText);
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
