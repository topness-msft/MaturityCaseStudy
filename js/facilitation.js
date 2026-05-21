// =====================================================================
// facilitation.js — presenter notes per slide.
// Pulled directly from the Facilitator Guide (PDF) and PPTX speaker
// notes, normalized into talk track / probes / expected responses /
// mistakes / per-choice probes.
// =====================================================================

window.FACILITATION = {

'title': {
  talk: 'Hi, I\'m [NAME] and this is [NAME]. We\'re with Microsoft\'s Copilot Acceleration Team. Over the past year, we\'ve worked hands-on with top customers to build thousands of AI agents. For the next 35 minutes, we\'ll do a case discussion based on Woodgrove Bank — along the way we\'ll introduce a maturity model and transformation patterns. Don\'t worry about capturing notes — we\'ll share resources at the end.',
  probes: [],
  expected: [],
  mistakes: [
    'Don\'t over-introduce yourselves — the room came for the case, not the bios.',
    'Don\'t promise frameworks "they\'ll learn" — promise they\'ll DECIDE.'
  ]
},

'opening-poll': {
  talk: 'Reveal one card at a time. Hands stay up only if each statement is still true — count out loud so the room sees the curve. (Typical: ~80% pilot, ~40% production, ~15% dependency, ~5% governance.)',
  probes: [
    '"Hands up if you\'ve piloted an agent — something beyond chat or copilot — in the last 12 months."',
    '"Keep it up if you\'ve actually shipped one. At least one agent in production touching real customers or real enterprise data."',
    '"Keep it up if the business now depends on it. If it broke tomorrow, you\'d feel it."',
    'Pause 2 seconds before reveal 4: "And the last one is the one that keeps me up at night — keep your hand up if you have a formal model for it. Identity, evaluation, monitoring, rollback, human-in-the-loop."'
  ],
  expected: [
    { response: '"Copilot counts as an agent"',
      reply: 'Fair challenge — if we count copilots, every hand stays up and the question gets boring. I\'m drawing a line at agents that take actions on their behalf, not just suggest them. Hold that distinction — it matters for governance.' },
    { response: '"We have hundreds in production" (over-claim)',
      reply: 'Love it — and you\'re the exception. Hold that thought, because the next question is whether the business would notice if you turned them off.' }
  ],
  mistakes: [
    'Don\'t skip the pause before the governance reveal — it\'s what makes the drop-off land.',
    'Don\'t debate the count — keep it directional.'
  ],
  closingLine: 'Look around. Most of you are building faster than you\'re governing. That\'s the gap we\'re going to talk about today. But first — let\'s hear from Sarah, the CIO at Woodgrove.'
},

'sarah-video': {
  talk: 'Play the 90-second video. Sarah introduces herself and the challenge. If the video doesn\'t play, open "Read instead" and read the scenario aloud — it\'s the same content.',
  probes: [],
  expected: [],
  mistakes: [
    'Don\'t let the audience get distracted by Sarah being AI-generated. Light-hearted bit of fun — keep moving.',
    'Don\'t pre-judge or commentate during the video — let her introduce herself.'
  ],
  closingLine: 'Keep this in mind. I\'m about to ask you what Sarah should do.'
},

'setup': {
  talk: 'Walk through the three survey numbers, then the company facts and the board mandate. Land on the quote — Sarah has activity, not strategy.',
  probes: [
    'After reading 66/45/13: "Anyone surprised by these numbers?"',
    '"What does \'AI activity without AI strategy\' actually look like in your org?"'
  ],
  expected: [
    { response: '"$20M is a lot — surely they\'re further along"',
      reply: 'You\'d think so. Hold that thought — we\'ll see exactly what the $20M bought.' }
  ],
  mistakes: [
    'Don\'t over-explain the bullets. Let the numbers do the work.',
    'Don\'t skip the quote — "platform built for transformation running a FAQ bot" is the hook.'
  ],
  closingLine: 'In a moment, I\'m going to ask you what Sarah should do first.'
},

'act1-poll': {
  talk: 'Read the four options aloud. Vote by hand-raise — 30 seconds max. Then cold-call 2–3 people for 2 minutes. Don\'t debate; let them commit.',
  probes: [
    '"You picked B — value discovery for what exactly? Which processes? Which outcomes?"',
    '"You picked A — what\'s their first brief with only 2 low-value agents in production?"',
    '"Notice how split we are. What does that tell you?"',
    'If everyone picks B: "Does anyone feel uncomfortable with that? Discovery for what?"'
  ],
  expected: [
    { response: '"It\'s obviously B — you can\'t scale what you can\'t discover"',
      reply: 'Discover value in which processes though? Hold that thought. In 2 minutes I\'ll show you data that changes the picture.' },
    { response: '"They need C — it\'s a bank, you need governance"',
      reply: 'You\'re thinking about foundations. Let\'s see if the data supports that priority.' },
    { response: '"D is interesting — but how do you get 4,200 people moving?"',
      reply: 'Great question. We\'ll come back to that. For now, commit to your vote.' },
    { response: '"She needs to do all of these"',
      reply: 'Hold that thought.' }
  ],
  mistakes: [
    'Don\'t give the answer too early. Power is in letting them commit, then revealing each option maps to a single pillar.',
    'Don\'t skip the vote — hand-raises create commitment and make the reveal land.'
  ],
  choiceProbes: {
    A: 'They picked A — strategic thinkers. They see the coordination gap. Probe: "An AI strategy lead with what scope? What\'s their first brief?"',
    B: 'They picked B — measurement-minded. This is the subtle "trap." Probe: "Discovery in which processes? You haven\'t mapped them yet."',
    C: 'They picked C — risk-minded. Strong instinct for a bank. Probe: "How long does an agent take to ship today? What\'s the target?"',
    D: 'They picked D — people-first instinct. Closest to the culture gap. Probe: "How do you scale enthusiasm without strategy?"'
  },
  closingLine: 'Let me show you something about Woodgrove that changes the picture.'
},

'maturity': {
  talk: 'Sarah\'s first move was a maturity assessment across five pillars. Tech is at 400 — production-ready infrastructure, strongest pillar. Governance is at 300 — solid compliance foundation. PAUSE. Ask the room to predict the other three before you reveal.',
  probes: [
    '"Two strong pillars. So what went wrong? Where do AI Strategy, Business Process Mapping, and Culture land?"',
    '"AI Strategy — what\'s your gut?"',
    '"Business Strategy — they have process methodology. Where does it land for AI?"',
    '"Culture — 4,200 employees, $20M spent, only 2 agents live. Where does culture land?"',
    'After reveal: "Which surprises you most?" Take 2–3 hands.'
  ],
  expected: [
    { response: '"But they have good tech! 400 is great."',
      reply: 'Tech is at 400. Governance at 300. That\'s the foundation. But AI strategy, business strategy, and culture all at 200? Three pillars stuck. That\'s the enablement gap.' },
    { response: '"200 isn\'t that low"',
      reply: '200 means capabilities exist in pockets. Can you name the exec who owns the AI portfolio? The outcome KPIs? That\'s the difference between 200 and 300.' },
    { response: '"Governance at 300 — shouldn\'t they build on that?"',
      reply: 'Exactly right. Governance is a foundation to build on — but they need agent-specific classification and lifecycle. That\'s the jump to 400.' }
  ],
  mistakes: [
    'Don\'t reveal AI Strategy / BP / Culture before the room predicts. The prediction creates the surprise.',
    'Don\'t walk all five pillars equally — Tech and Governance are the strengths; the three at 200 are the story.'
  ],
  closingLine: '$20M bought tech and governance. It did NOT buy AI strategy, business process redesign, or culture change. Let\'s go back to your four options and see what they actually tell us.'
},

'bridge': {
  talk: 'This is the first major aha moment. DON\'T walk all four rows yourself. Reveal ONLY option A → AI Strategy → 200. Then ask the room to guess B/C/D.',
  probes: [
    '"Who can guess what the other three options map to?"',
    'Cold-call: "You voted B — which pillar?"',
    'After all four are mapped: "You were all right. And you were all wrong."'
  ],
  expected: [
    { response: '"Can\'t you do all four?"',
      reply: 'With what resources? In 12 months? The board gave Sarah a mandate, not a blank cheque. Every organization faces the same constraint: limited capacity for change. Patterns help you choose.' }
  ],
  mistakes: [
    'Don\'t reveal the bottom insight card before the four rows are mapped.',
    'Don\'t over-explain. Let the room discover the insight.'
  ],
  closingLine: 'Each option fixes ONE pillar. Transformation needs a Pattern. There are six. Let me show you, and you\'ll pick one.'
},

'patterns': {
  talk: 'Briefly frame the six patterns in three modes: first two ASSIST (human-in-the-loop), next three EXECUTE (agents take action), last one TRANSFORM (net-new). Don\'t walk all six in detail — keep it under 90 seconds.',
  probes: [
    '"Given AI strategy, business strategy, and culture at 200, tech at 400, governance at 300 — which patterns are OUT OF REACH?"',
    '"Can Woodgrove do AI-First Capabilities? Why not?"',
    '"Core Business Processes — customer-facing agents with strategy at 200?"',
    'After elimination: "We\'re down to two. Who says Business Expert Empowerment? Who says Workplace & IT Services?"'
  ],
  expected: [
    { response: '"Core Business Processes — the board wants P&L impact"',
      reply: 'Do they have the maturity to execute end-to-end process transformation? With AI Strategy at 200, that\'s Δ300. Not in 12 months.' },
    { response: '"Employee enablement — start with empowerment"',
      reply: 'What about this pattern makes it achievable given their maturity? It also doesn\'t prove the operating model.' },
    { response: '"Business Expert Empowerment — empower domain experts"',
      reply: 'Interesting instinct. What makes you think depth-first is the right play? It proves people can use AI but not that the org can operate it.' },
    { response: '"All of them"',
      reply: 'Good instinct. Do you think she has the capacity to do all that in 12 months?' }
  ],
  mistakes: [
    'Don\'t lecture on the patterns. Let the room eliminate.',
    'Don\'t reveal Sarah\'s choice on this slide. Save it for the next one.'
  ],
  choiceProbes: {
    p1: 'Employee AI Enablement — broad but shallow. Probe: "Does that move the board\'s needle in 12 months?"',
    p2: 'Business Expert Empowerment — proves people can use AI. Probe: "What does it NOT prove? Governance, lifecycle, operating model."',
    p3: 'Workplace & IT Services — proves the org can OPERATE agents. Probe: "Why is this the right starting bet?"',
    p4: 'Core Business Processes — high ambition. Probe: "AI Strategy at 200 → 500 is Δ300. Achievable in 12 months?"',
    p5: 'External Engagement — customer-facing. Probe: "After a security incident, who\'s underwriting external-facing agents?"',
    p6: 'AI-First Capabilities — net-new. Probe: "Do they have the strategy and culture to greenlight net-new products?"'
  },
  closingLine: 'Let me show you what Sarah actually chose — and why.'
},

'bet': {
  talk: 'There\'s no single right answer. The pattern depends on maturity — but also on what\'s happening in the organization. Sarah picks Workplace & IT Services as the bet, with Business Expert Empowerment in parallel. Walk the four quadrants quickly.',
  probes: [
    '"Who expected Core Business Processes? What would you challenge about starting with Workplace & IT Services?"',
    '"What does Workplace & IT Services prove that Business Expert Empowerment doesn\'t?" (expect: governance, operating model, lifecycle)',
    '"When should Woodgrove expand to Core Business Processes?" (expect: once governance and adoption are proven)'
  ],
  expected: [
    { response: '"Workplace & IT Services is too cautious — the board wants P&L impact"',
      reply: 'Show the board: we proved governance, adoption, measurement in 6 months. Now we\'re ready for lending. That\'s a stronger story than 3 of 5 Core Business Processes agents stalling.' },
    { response: '"Why not go straight to Core Business Processes?"',
      reply: 'With AI strategy at 200, Core Business Processes needs AI Strategy at 500 — that\'s Δ300. Workplace & IT Services leverages the tech and business foundation — AI strategy gap is Δ200, manageable.' },
    { response: '"Why not Business Expert Empowerment — start with people?"',
      reply: 'Business Expert Empowerment is defensible — it proves people can use AI. But the board doesn\'t want activity — they want operating proof. Workplace & IT Services proves governance, lifecycle, measurement.' }
  ],
  mistakes: [
    'Don\'t treat this as "lowering ambition." It\'s sequencing risk — the language matters.',
    'Don\'t skip "in parallel" — Business Expert Empowerment isn\'t a backup, it\'s a deliberate second bet.'
  ],
  closingLine: 'Good. We have the bet. Now let\'s see what it actually takes to execute — where are the gaps, and how does Woodgrove organize to close them?'
},

'gaps': {
  talk: 'Show the slide. Let the room absorb the numbers. Something should jump out immediately — Tech at Δ0. Don\'t walk every gap; let them notice.',
  probes: [
    '"What\'s the first thing you see?"',
    '"AI Strategy is at 200 — no roadmap, no sponsor, no portfolio. What happens if you try to scale agents without that?"',
    '"Business Process is also at 200 — no end-to-end redesign, no AI-specific KPIs. Can you measure success without those?"',
    '"Governance is at 300 — closest to ready. What would it take to get agent-specific classification and lifecycle?"',
    '"If every gap is just Δ100 or Δ200, what\'s actually hard about this? Why don\'t more orgs close these gaps?"'
  ],
  expected: [
    { response: 'Vague answers about "people" or "leadership"',
      reply: 'Be specific. Name a process. Name a metric. Vague plans are why agents stall.' },
    { response: 'Good: "Build the champion network"',
      reply: 'Only 13% feel rewarded. Find the enthusiasts in IT first. Make them champions. Train them to train their peers.' }
  ],
  mistakes: [
    'Don\'t walk every gap — let them spot Δ0 on Tech themselves.',
    'Don\'t accept generalities. Push for specifics.'
  ],
  closingLine: 'Woodgrove\'s challenge is no longer technical possibility. It\'s operating discipline.'
},

'opmodel': {
  talk: 'Show the slide but DON\'T walk through it. Pose the challenge first: "You\'re Sarah\'s new CoE lead. Day one. 90 days to board review. First three moves?" Then reveal what Sarah did, walking the three horizons in under a minute.',
  probes: [
    '"What\'s move number one?"',
    '"And move two?"',
    '"Who has a different first move? What and why?"',
    'Validate good answers as they come — map IT processes, set up governance, find champions, pick 3–5 agents, define baselines.'
  ],
  expected: [
    { response: '"Map the IT processes"',
      reply: 'Yes — ticket routing, provisioning, onboarding. Where\'s the most volume?' },
    { response: '"Set up governance"',
      reply: 'Agent classification, ownership model, approval workflow.' },
    { response: '"Find the champions"',
      reply: 'Only 13% feel rewarded. Find the enthusiasts in IT first.' },
    { response: '"Pick 3-5 agents"',
      reply: 'Portfolio discipline. Replace the FAQ bot with real transformation.' },
    { response: '"Define success metrics"',
      reply: 'Baselines BEFORE deploying. Usage → task completion → business outcomes.' },
    { response: '"This is too cautious / the board wants P&L impact"',
      reply: 'This isn\'t cautious. It\'s disciplined. Show the board: we proved governance, adoption, measurement in 6 months. Now we\'re ready for lending and credit. That\'s a stronger story than 3 of 5 agents stalling.' }
  ],
  mistakes: [
    'Don\'t walk every horizon point — briefly mention each gap had actions taken to close it.',
    'Don\'t skip the challenge moment — the room\'s answers ARE the content.'
  ],
  closingLine: 'Bet + gaps + model. Let\'s see what happens when they execute.'
},

'mirror': {
  talk: 'This is the most important moment. PAUSE before you reveal. Say: "Woodgrove was fiction." Pause. "But these numbers came from real data — 20,000 workers surveyed in the 2026 Work Trend Index." Then read 66 / 45 / 13 slowly. Read the Lakhani quote. Hold 5 seconds of silence.',
  probes: [],
  expected: [],
  mistakes: [
    'Don\'t rush the "Woodgrove was fictional" beat. Pause is the point.',
    'Don\'t commentate during the reveal — let it land.',
    'Don\'t skip the 5 seconds of silence after the quote.'
  ],
  closingLine: 'The question for each of you: will you run this diagnostic for your own organization this month?'
},

'three-decisions': {
  talk: 'Read the three decisions. Pick one — usually #1 — and open it to the room. Cold-call 3–4 people.',
  probes: [
    '"What pattern is your firm actually pursuing? Not what you wish — what your investments describe."',
    '"Is that the right pattern given your maturity?"',
    '"Could you name your ONE scale-breaker gap right now?"',
    'If stalls: "Show of hands — who has a deliberate AI strategy, not just AI activity?" (few hands)',
    'If defensive: "Every situation IS different. That\'s why patterns matter — match ambition to readiness."'
  ],
  expected: [
    { response: '"We\'re doing all of them"',
      reply: 'Which one has the executive sponsor, the metrics, and the operating model? That\'s the one you\'re actually doing.' }
  ],
  mistakes: [
    'Don\'t answer for the room. The discomfort is the point.',
    'Don\'t over-coach — if 30 seconds of silence happens, let it happen.'
  ],
  closingLine: 'The frameworks are all available. The question is whether you\'ll run this for your own organization this month.'
},

'resources': {
  talk: 'Point to Adoption Pulse — aka.ms/adoptionpulse — as the primary CTA. Briefly mention the additional resources. Thank the room.',
  probes: [],
  expected: [],
  mistakes: [
    'Don\'t cram all five resources equally — Adoption Pulse is the actionable one.'
  ],
  closingLine: 'Thank you for your thinking today.'
}

};
