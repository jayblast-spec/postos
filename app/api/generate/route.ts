import { NextRequest, NextResponse } from "next/server";
import type { VoiceProfile, Platform } from "../../../lib/types";
import { PLATFORM_CONFIG } from "../../../lib/types";

export const maxDuration = 60;

type WeekPost = {
  week: number;
  day: "Monday" | "Tuesday" | "Thursday" | "Friday";
  hook: string;
  content: string;
};

const DAYS: Array<"Monday" | "Tuesday" | "Thursday" | "Friday"> = [
  "Monday", "Tuesday", "Thursday", "Friday",
];

// Fixes literal newlines inside JSON string values — the most common Groq formatting bug
function repairJson(raw: string): string {
  // Strip code fences
  let s = raw.replace(/^```(?:json)?\s*/m, "").replace(/\s*```\s*$/m, "").trim();
  // Extract just the JSON object
  const start = s.indexOf("{");
  const end = s.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON object found");
  s = s.slice(start, end + 1);
  // Replace literal newlines and carriage returns inside string values
  let result = "";
  let inString = false;
  let escape = false;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (escape) {
      result += ch;
      escape = false;
      continue;
    }
    if (ch === "\\") {
      escape = true;
      result += ch;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString) {
      if (ch === "\n") { result += "\\n"; continue; }
      if (ch === "\r") { result += "\\r"; continue; }
      if (ch === "\t") { result += "\\t"; continue; }
    }
    result += ch;
  }
  return result;
}

// ---------- DEMO FALLBACK ----------

const DEMO_POSTS: WeekPost[] = [
  {
    week: 1,
    day: "Monday",
    hook: "🧭 Redesign the Work, Not the Toolbox",
    content: `🧭 Redesign the Work, Not the Toolbox
Most organizations are measuring AI success by the number of tools deployed. The ones that will lead are measuring it by the depth of workflow redesign.

Why Tool Adoption Without Structural Redesign Always Disappoints

The instinct when AI arrives is to deploy it onto existing roles and job descriptions. That instinct is understandable. It is also why most AI transformations underdeliver.

Layering AI on top of legacy structure creates a predictable pattern: initial enthusiasm, rising cognitive load, stalled productivity, blame placed on the tools. The tools are not the problem. The architecture is.

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

These roles are the difference between organizations that deploy AI responsibly and those that discover the cost of recklessness later.

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

The leaders who will navigate this era successfully are not the ones who can prompt an AI well. They are the ones who can interrogate an AI output — identify its assumptions, recognize its failure modes, and make a judgment about when to trust it and when to override it.

AI literacy is not about knowing how to use the tools.
It is about knowing what the tools cannot see.

🧠 Why This Matters

Interrogation is different from operation. Most AI training programs produce operators: people who can use a tool. The leadership need is for interrogators: people who can evaluate an output against its underlying logic and decide whether it is trustworthy.

Hallucination is a leadership risk, not just a technical bug. When an AI system produces confident-sounding output based on incorrect data, the damage is not technical — it is strategic.

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

For decades, the growth model was predictable. More revenue required more people. Scaling meant hiring. The relationship was linear, and headcount trajectory was one of the most reliable signals of organizational health.

That correlation is now structurally breaking — not because of layoffs, but because AI-augmented job design is expanding the scope of what a single human can steward without proportionally increasing cognitive load.

Growth no longer requires headcount expansion.
It requires workforce architecture that enables each person to steward more.

🧠 Why This Matters

Scope absorption, not headcount addition. An AI-augmented role designed correctly can absorb 40–60% more scope without increasing cognitive burden — because the right tasks have been delegated to AI execution.

Architecture makes the difference. Organizations achieving this are not deploying more AI tools. They are redesigning the work — redefining what humans decide, what AI executes, and where the handoff is governed.

Efficiency without austerity. The narrative around AI and headcount defaults to extremes: job elimination or no change. The actual opportunity is in the middle — fewer new hires required to support the same growth, achieved through design rather than displacement.

Measurement must evolve. Organizations measuring productivity by hours worked will systematically undervalue AI-augmented roles. The new metric is judgment quality and outcome quality per role.

🌍 Strategic Implications for Leaders

Decoupling growth from headcount is a strategic architecture decision, not an HR policy:

CEOs must stop measuring organizational health by headcount growth and start measuring by output per augmented role — a fundamentally different view of organizational capacity.

CHROs must design the dynamic job architecture that makes this possible: redefining roles as living human-AI collaboration frameworks that evolve as AI capabilities evolve.

CIOs and CTOs must build the technical architecture that delivers on this promise — integrated AI embedded in the flow of work, not sitting adjacent to it as an optional add-on.

Employees who embrace augmented roles will develop the most differentiated skill set in the market: the ability to direct, govern, and quality-control AI execution at a professional level.

The lesson is clear: Headcount reduction through AI is a short-term cost strategy. Headcount decoupling through AI architecture is a long-term growth strategy.

🧭 New Roles Emerging from Augmented Architecture

AI Workforce Capacity Planner: Models the relationship between AI augmentation levels and organizational output, enabling leaders to make growth decisions based on architecture rather than headcount projections.

Role Redesign Consultant (Internal): Works with department leaders to deconstruct existing roles and rebuild them around the human-AI collaboration boundary specific to that function.

Augmentation Quality Assurance Lead: Monitors whether AI-augmented roles are delivering the intended scope expansion without increasing error rates or reducing decision quality.

Organizational AI ROI Analyst: Measures and reports the actual productivity lift from AI architecture decisions, creating the evidence base that justifies continued investment in workforce redesign.

These roles represent the operational infrastructure required to make AI-augmented growth repeatable, measurable, and sustainable.

Because in the age of AI acceleration, the competitive advantage is not the AI you have deployed. It is the organizational architecture you have built to deploy it with precision.

hashtag#WorkforceArchitecture hashtag#AIAugmentation hashtag#ScalableGrowth hashtag#OrganizationalDesign hashtag#FutureOfWork hashtag#LeadershipByDesign hashtag#BusinessStrategy hashtag#ArkNetThinking hashtag#DigitalTransformation hashtag#HumanInTheLoop`,
  },
];

function buildDemoContent(platform: Platform, weeks: number): WeekPost[] {
  const limit = PLATFORM_CONFIG[platform].charLimit;
  const result: WeekPost[] = [];
  for (let w = 1; w <= weeks; w++) {
    for (let d = 0; d < 4; d++) {
      const src = DEMO_POSTS[(w - 1) * 4 + d] ?? DEMO_POSTS[d % DEMO_POSTS.length];
      result.push({
        week: w,
        day: DAYS[d],
        hook: src.hook,
        content: platform === "linkedin"
          ? src.content
          : src.content.slice(0, limit),
      });
    }
  }
  return result;
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

  const linkedinStructure = platform === "linkedin" ? `
MANDATORY POST STRUCTURE (follow exactly, every post):
Line 1: [emoji] [Bold concept title]
Line 2-3: [1-2 sentence strategic subtitle naming the shift]
Blank line
Line: [Full subheading: "Why [X] Must Replace [Y]"]
Blank line
[3-4 sentence opening paragraph challenging the dominant assumption]
Blank line
[2-3 sentence paragraph deepening the argument with a specific mechanism or data point]
Blank line
[Bold reframe — standalone short line: "X isn't just Y."]
[Resolution — standalone short line: "It is the Z."]
Blank line
[emoji] Why This Matters
Blank line
[3-4 bolded strategic points, each: Bold term. Full explanatory sentence.]
Blank line
[emoji] Strategic Implications for Leaders
Blank line
[Opening sentence]
Blank line
CEOs [specific 1-2 sentence implication]
Blank line
CHROs [specific 1-2 sentence implication]
Blank line
CIOs and CTOs [specific 1-2 sentence implication]
Blank line
Employees [specific 1-2 sentence implication]
Blank line
The lesson is clear: [X is one thing]. [Y is a different, more important thing].
Blank line
[emoji] New Roles Emerging in [Topic Area]
Blank line
[Role Title 1]: [description]
Blank line
[Role Title 2]: [description]
Blank line
[Role Title 3]: [description]
Blank line
[Role Title 4]: [description]
Blank line
[2-3 sentence closing elevating to strategic conclusion]
Blank line
Because in the age of [context], [X] is the only path to [Y].
Blank line
hashtag#Tag1 hashtag#Tag2 hashtag#Tag3 hashtag#Tag4 hashtag#Tag5 hashtag#Tag6 hashtag#Tag7 hashtag#Tag8 hashtag#Tag9 hashtag#Tag10` : "";

  const systemPrompt = `You are a world-class ghostwriter producing executive thought leadership for ${platform}.

VOICE PROFILE:
- Tone: ${voiceProfile.toneDescriptors.join(", ")}
- Energy: ${voiceProfile.energyLevel}
- Post structure: ${voiceProfile.framingStyle}
- Topics: ${voiceProfile.topics.join(", ")}
- Signature phrases (use sparingly): ${voiceProfile.signaturePhrases.join(" | ")}
- Hashtag format: ${voiceProfile.hashtagStrategy}
- Hook patterns: ${voiceProfile.hookPatterns.join(" | ")}
- Writing style: ${voiceProfile.writingStyle}
- Audience: ${voiceProfile.audiencePositioning}
${linkedinStructure}

LENGTH: Each post MUST be ${platform === "twitter" ? "under 280 characters total" : `between ${Math.round(limit * 0.8)} and ${limit} characters — do not write short summaries, write the full argument`}.

QUALITY: Each post must contain a specific original strategic insight, not generic AI advice. Role breakdowns (CEOs/CHROs/CIOs/Employees) must be specific. The ${totalPosts} posts must each cover a DIFFERENT topic.

CRITICAL JSON RULES:
- Return ONLY valid JSON — no markdown code fences, no explanation before or after
- All newlines inside string values MUST be written as \\n (escaped), never as literal newlines
- All quotes inside string values must be escaped as \\"
- The response must start with { and end with }

JSON FORMAT:
{"posts":[{"week":1,"day":"Monday","hook":"first line only","content":"full post with \\n for line breaks"}]}

Generate ${totalPosts} posts: weeks 1-${durationWeeks}, days Monday/Tuesday/Thursday/Friday.`;

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
          content: `Generate ${totalPosts} ${platform} posts. Each must be a complete, full-length thought leadership piece of ${platform === "twitter" ? "under 280 characters" : `at least ${Math.round(limit * 0.8)} characters`}. Return only valid JSON, no code fences.`,
        },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Groq API error:", res.status, errText);
    return NextResponse.json({ error: "Groq error" }, { status: 500 });
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "{}";

  let parsed: { posts: WeekPost[] };
  try {
    const cleaned = repairJson(raw);
    parsed = JSON.parse(cleaned);
  } catch (e) {
    console.error("Parse error. Raw (first 500):", raw.slice(0, 500));
    console.error("Parse error detail:", e);
    return NextResponse.json({ error: "Parse error" }, { status: 500 });
  }

  return NextResponse.json({ posts: parsed.posts ?? [], demo: false });
}
