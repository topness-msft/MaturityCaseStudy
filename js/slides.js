// =====================================================================
// slides.js — content & reveal structure for all 14 slides
// Each slide declares: id, act, title, timing, render layout key, and a
// config object the renderer uses. Reveal beats are explicit so both
// modes preserve the facilitator's staged tension.
// =====================================================================

window.SLIDES = [

// 1 -------------------------------------------------------------------
{
  id: 'title',
  act: 0, actLabel: 'Opening',
  title: 'Driving Agent Adoption at Scale',
  subtitle: 'From Pilot to Business Impact',
  timing: { presentSeconds: 120 },
  render: 'title',
  config: {
    eyebrow: 'Interactive case study',
    tagline: 'A fictional bank. A real strategic problem. Your call.',
    heroImage: './assets/sarah-chen-hero.jpg',
    heroImageWebp: './assets/sarah-chen-hero.webp',
    heroAlt: 'Sarah Chen, CIO of Woodgroove Bank'
  }
},

// 2 -------------------------------------------------------------------
{
  id: 'opening-poll',
  act: 0, actLabel: 'Opening · Gathering',
  title: 'Where are you in deploying agents?',
  subtitles: {
    self: 'Pick the highest rung your organization has actually reached.',
    present: 'Most rooms thin out dramatically as the bar rises.'
  },
  timing: { presentSeconds: 15, discussSeconds: 90 },
  render: 'stages',
  config: {
    presenterPrompt: 'Reveal one card at a time. Hands stay up as long as each statement is true — count out loud after each reveal so the room sees the curve.',
    selfPrompt: 'How far has your organization actually gotten? Pick the highest level that\'s true.',
    stages: [
      { id: 's1', label: 'Exploration', detail: 'Piloted an agent — beyond chat / copilot — in the last 12 months.', expectedPct: 80, accent: 'empower',
        insight: 'You\'re in the largest cohort — about 80% of rooms raise their hand here. The hard part isn\'t starting; it\'s getting from one pilot to one the business actually depends on. That gap is what the rest of this case is about.' },
      { id: 's2', label: 'Production',  detail: 'Shipped at least one agent in production touching real customers or enterprise data.', expectedPct: 40, accent: 'empower',
        insight: 'About 40% reach this rung. You\'ve cleared the hardest technical bar — real data, real users — but the next jump is bigger than the first. Most production agents never become something the business genuinely depends on.' },
      { id: 's3', label: 'Dependency',  detail: 'The business now depends on it — if it broke tomorrow, you\'d feel it.', expectedPct: 15, accent: 'reshape',
        insight: 'Only about 15% are here. The business feels you when it breaks. The question that defines what\'s next: are you actually governing it, or just hoping it keeps working? Sarah\'s story will look familiar.' },
      { id: 's4', label: 'Governance',  detail: 'Formal model: identity, evaluation, monitoring, rollback, human-in-the-loop.', expectedPct: 5,  accent: 'reinvent',
        insight: 'About 5% claim this rung — and most are overestimating. Real Stage 4 means identity, evaluation, monitoring, rollback, and human-in-the-loop wired in by default. If you\'re really here, this case is about how to bring everyone else up safely.' }
    ],
    selfInsight: 'Most organizations are building faster than they\'re governing. By the time we hit "the business depends on it," most rooms have only a few hands up — and "governed at scale" thins out further. That gap is what this session is about.'
  }
},

// 3 -------------------------------------------------------------------
{
  id: 'sarah-video',
  act: 1, actLabel: 'Act 1 · The Setup',
  title: 'Meet Sarah Chen, CIO of Woodgrove Bank',
  subtitle: 'A 90-second video introduction. If it doesn\'t play, open the read-along below.',
  timing: { presentSeconds: 135 },
  render: 'video',
  config: {
    youtubeId: 'bjXtThx4uIY',
    fallbackTitle: 'Read instead — scenario script',
    fallbackBody: 'Sarah Chen is CIO of Woodgrove Bank. Her board gave her a clear mandate: make AI deliver measurable business outcomes within 12 months. Woodgrove has already spent $20 million on digital transformation. They have 2 AI agents live and 17 more pilots — mortgage pre-qualification, KYC verification, fraud detection — but none of them are at scale, and none connect to a business KPI. A recent employee survey revealed something uncomfortable: 66% say AI is helping them do higher-value work. But 45% say it feels safer to focus on current goals than redesign work for AI. And only 13% feel rewarded for reinventing how work gets done. So here\'s Sarah\'s dilemma: she has technology, she has pilots, she has a board breathing down her neck. What she doesn\'t have is a strategy.',
    closingLine: 'Keep this in mind. I\'m about to ask you what Sarah should do.'
  }
},

// 4 -------------------------------------------------------------------
{
  id: 'setup',
  act: 1, actLabel: 'Act 1 · The Setup',
  title: 'Woodgrove Bank — the situation',
  subtitle: 'A recent employee survey revealed three uncomfortable numbers.',
  timing: { presentSeconds: 180, discussSeconds: 120 },
  render: 'setup',
  config: {
    stats: [
      { num: '66%', label: 'of employees say AI lets them do higher-value work — but none connects to a business KPI', accent: 'blue' },
      { num: '45%', label: 'say it feels safer to focus on current goals than redesign work for AI', accent: 'amber' },
      { num: '13%', label: 'feel rewarded for reinventing how work gets done', accent: 'pink' }
    ],
    company: {
      title: 'The Company',
      bullets: [
        '4,200 employees across retail, commercial, and wealth management',
        '18 months into Copilot (2,800 licenses deployed)',
        '2 AI agents live — an FAQ bot and an email-triage agent. 17 pilots. Nothing at scale.',
        '$20M in prior digital transformation spend'
      ]
    },
    mandate: {
      title: 'The Board Mandate',
      bullets: [
        'Measurable AI economics in 12 months',
        'CEO wants results. CISO wants controls. Sarah is in the middle.'
      ]
    },
    quote: {
      text: 'We have AI activity. We don\'t have an AI strategy. Now I have a platform built for transformation running a FAQ bot.',
      attrib: '— Sarah Chen, CIO'
    }
  }
},

// 5 -------------------------------------------------------------------
{
  id: 'act1-poll',
  act: 1, actLabel: 'Act 1 · The Poll',
  title: 'What should Sarah do first?',
  subtitle: 'Commit before you reveal — every option is defensible.',
  timing: { presentSeconds: 30, discussSeconds: 90 },
  render: 'poll',
  config: {
    selfPrompt: 'What action should Sarah do next? Commit to one next action.',
    choices: [
      { id: 'A', headline: 'Appoint an AI strategy lead', meta: 'Build a prioritized agent roadmap.',
        selfProbe: 'You\'re thinking like a coordinator — you see a leadership gap. Hold this question: what\'s their first brief, given only 2 low-value agents are live? A roadmap leads nowhere without process redesign or governance.' },
      { id: 'B', headline: 'Run a value discovery across BUs', meta: 'Find the highest-ROI agent use cases.',
        selfProbe: 'You\'re measurement-minded. This is the most popular pick — and the subtle trap. Discovery in which processes? Woodgrove hasn\'t mapped them for AI yet. You can\'t discover value in processes you haven\'t mapped.' },
      { id: 'C', headline: 'Direct Security & Compliance to build a fast-track approval path', meta: 'Get agents into production faster.',
        selfProbe: 'Strong risk instinct — sensible for a bank. But ask yourself: how long does an agent take to ship today? What target makes the pipeline real? Without a target, "fast-track" is just a slogan.' },
      { id: 'D', headline: 'Find motivated early adopters', meta: 'Equip them to redesign work in their teams.',
        selfProbe: 'You\'re people-first — closest to the culture gap. The harder question: how do you scale 50 enthusiasts to 4,200 people without an underlying strategy? Without it, enthusiasm stalls.' }
    ],
    expectedSplit: { A: 20, B: 30, C: 30, D: 20 },
    afterChoiceInsight: 'Notice how split the room usually is. Every option is reasonable. Let\'s look at what\'s actually going on inside Woodgrove.'
  }
},

// 6 -------------------------------------------------------------------
{
  id: 'maturity',
  act: 2, actLabel: 'Act 2 · The Diagnosis',
  title: 'Activity ≠ maturity. Spend ≠ maturity.',
  subtitles: {
    self: 'After a recent maturity review, Woodgrove\'s pillars came back uneven. Technology scored 400. Governance & Security 300. Before you reveal — what do you think AI Strategy, Business Process, and Culture score?',
    present: 'After a recent maturity review, Woodgrove\'s pillars came back uneven. Two strong, three unknown. Reveal Tech and Governance first, then ask the room to predict the other three.'
  },
  timing: { presentSeconds: 60, discussSeconds: 180 },
  render: 'maturity',
  config: {
    pillars: [
      { id: 'tech', label: 'Technology',              value: 400, level: 'strong',   revealOrder: 1 },
      { id: 'gov',  label: 'Governance & Security',   value: 300, level: 'moderate', revealOrder: 2 },
      { id: 'ais',  label: 'AI Strategy & Experience', value: 200, level: 'weak',     revealOrder: 4, hidden: true },
      { id: 'bp',   label: 'Business Process Mapping', value: 200, level: 'weak',     revealOrder: 5, hidden: true },
      { id: 'culture', label: 'Organization & Culture', value: 200, level: 'weak',    revealOrder: 6, hidden: true }
    ],
    scaleMax: 500,
    predictPause: {
      title: 'Pause — before you reveal',
      body: 'Tech is at 400. Governance at 300. Where do you think AI Strategy, Business Process Mapping, and Culture land?'
    },
    selfPrompt: 'Pick a value for each hidden pillar before you reveal. Commit before you see the answer.',
    insight: '$20M bought technology and governance. It did NOT buy AI strategy, business process redesign, or culture change. Three pillars stuck at 200. That\'s the gap Sarah needs to close.'
  }
},

// 7 -------------------------------------------------------------------
{
  id: 'bridge',
  act: 2, actLabel: 'Act 2 · The Bridge',
  title: 'Every option fixes one pillar — and only one.',
  subtitles: {
    self: 'Each of Sarah\'s four options addresses exactly one pillar. Option A maps to AI Strategy — match B, C, and D to the pillar each would fix. All four are necessary; none is sufficient on its own. The right first move depends on what KIND of transformation you\'re betting on. That\'s called a pattern.',
    present: 'Each option fixes one pillar — and only one. Reveal A first, then ask the room to predict B, C, and D. Land the takeaway: all four are necessary, none sufficient alone. The right first move depends on the pattern you\'re betting on.'
  },
  timing: { presentSeconds: 60, discussSeconds: 120 },
  render: 'bridge',
  config: {
    mappings: [
      { id: 'A', option: 'Appoint an AI strategy lead', detail: 'You\'d be fixing the leadership gap. But without process redesign or governance, a roadmap leads nowhere.', pillar: 'AI Strategy', value: 200, revealOrder: 1 },
      { id: 'B', option: 'Run a value discovery across BUs', detail: 'You can\'t discover value in processes you haven\'t mapped for AI.', pillar: 'Business Process Mapping', value: 200, revealOrder: 2, hidden: true },
      { id: 'C', option: 'Fast-track agent approval path', detail: 'Solid compliance foundation but no agent-specific fast track. Every agent stays a 6-month approval.', pillar: 'Governance', value: 300, revealOrder: 3, hidden: true },
      { id: 'D', option: 'Equip motivated early adopters', detail: 'You\'d be fixing the people gap. But without strategy, enthusiasm stalls.', pillar: 'Org & Culture', value: 200, revealOrder: 4, hidden: true }
    ],
    selfPrompt: 'Before revealing — try to match B, C, and D to the pillar each one would fix.'
  }
},

// 8 -------------------------------------------------------------------
{
  id: 'patterns',
  act: 3, actLabel: 'Act 3 · The Choice',
  title: 'You can\'t transform everything at once',
  subtitle: 'Six patterns. The question isn\'t what\'s possible — it\'s what to bet on first.',
  timing: { presentSeconds: 180, discussSeconds: 180 },
  render: 'patterns',
  config: {
    selfPrompt: 'Given Woodgrove\'s maturity — three pillars at 200, tech at 400, governance at 300 — which pattern should Sarah bet on first?',
    modes: [
      {
        id: 'assist', title: 'Assist', sub: 'Human in the loop',
        patterns: [
          { id: 'p1', name: 'Employee AI Enablement', tag: 'Give everyone an AI assistant',
            selfProbe: 'Sit with: how would you prove the board this moved the P&L in 12 months? What would the attribution story look like?' },
          { id: 'p2', name: 'Business Expert Empowerment', tag: 'Scale expert knowledge',
            selfProbe: 'Sit with: which capability does this NOT exercise? If the board asks about governance, lifecycle, or operating model in 12 months, what would you show them?' }
        ]
      },
      {
        id: 'execute', title: 'Execute', sub: 'Agents take action',
        patterns: [
          { id: 'p3', name: 'Workplace & IT Services', tag: 'Transform internal services',
            selfProbe: 'Sit with: which audience is most forgiving of an agent that occasionally gets it wrong? What does it cost Woodgrove if the first agent fails here vs. elsewhere?' },
          { id: 'p4', name: 'Core Business Processes', tag: 'Re-imagine end-to-end workflows',
            selfProbe: 'Sit with: AI Strategy is at 200 and Business Process is at 200 — both need to reach 400+ for this pattern. How many months of work is that, and what has to be true to compress it?' },
          { id: 'p5', name: 'External Engagement', tag: 'Re-invent customer experiences',
            selfProbe: 'Sit with: a recent security incident is fresh. Who at Woodgrove signs off on customer-facing agents this year, and what evidence would they need to see first?' }
        ]
      },
      {
        id: 'transform', title: 'Transform', sub: 'Net-new innovation',
        patterns: [
          { id: 'p6', name: 'AI-First Capabilities', tag: 'Net-new AI-native products',
            selfProbe: 'Sit with: AI Strategy and Culture are both at 200. What would you need to see in those pillars before you\'d feel comfortable greenlighting a net-new AI-native product?' }
        ]
      }
    ],
    sarahPicks: ['p3', 'p2']  // Workplace & IT Services + Business Expert Empowerment
  }
},

// 9 -------------------------------------------------------------------
{
  id: 'bet',
  act: 3, actLabel: 'Act 3 · The Bet',
  title: 'The bet: Workplace & IT Services',
  subtitle: 'Each pattern has a different maturity profile. The right choice depends on your gaps, your constraints, and where you can act.',
  timing: { presentSeconds: 120, discussSeconds: 120 },
  render: 'bet',
  config: {
    sarahChoice: { primary: 'p3', parallel: 'p2' },
    sarahChoiceLabel: 'Workplace & IT Services',
    sarahParallelLabel: 'Business Expert Empowerment',
    quadrants: [
      {
        id: 'bet', accent: 'bet', eyebrow: 'The Bet',
        title: 'Workplace & IT Services',
        items: [
          'Gaps are in Sarah\'s control to close',
          'IT services touch every employee — visible, measurable',
          'Lower regulatory risk — highest confidence of success',
          'Proves the operating model before higher-stakes processes'
        ]
      },
      {
        id: 'parallel', accent: 'parallel', eyebrow: 'In Parallel',
        title: 'Business Expert Empowerment',
        items: [
          'Scale domain knowledge while IT services prove the model',
          'Experts become force multipliers',
          'Builds the people muscle alongside the operating muscle'
        ]
      },
      {
        id: 'value', accent: 'value', eyebrow: 'Expected Value',
        title: '12-month outcomes',
        items: [
          '40–70% of L1 tickets automated',
          'IT provisioning: days → hours',
          'Onboarding agents live across 3+ departments',
          'Proven operating and governance model',
          'Champion network ready for the next wave'
        ]
      },
      {
        id: 'notwhy', accent: 'notwhy', eyebrow: 'Why Not the Others',
        title: 'Context-specific exclusions',
        items: [
          'Employee AI Enablement — mid-upgrade of a legacy banking system; too much change underway',
          'External Engagement — a recent security incident; external-facing agents would face resistance',
          'Core Business Processes — this work proves the operating model needed to get there'
        ]
      }
    ]
  }
},

// 10 ------------------------------------------------------------------
{
  id: 'gaps',
  act: 4, actLabel: 'Act 4 · The Plan',
  title: 'Every gap is closeable',
  subtitle: 'Target maturity to ship Workplace & IT Services. Click each pillar to see Sarah\'s action.',
  timing: { presentSeconds: 60, discussSeconds: 180 },
  render: 'gaps',
  config: {
    selfPrompt: 'Where would you start? What feels most urgent to close?',
    gaps: [
      { id: 'ais',     pillar: 'AI Strategy',          current: 200, target: 400, delta: 200,
        action: 'Appoint executive sponsor. Build roadmap tied to IT service outcomes. Stop low-value pilots — portfolio discipline.' },
      { id: 'bp',      pillar: 'Business Process',     current: 200, target: 400, delta: 200,
        action: 'Map IT service processes end-to-end for AI redesign. Define AI-specific KPIs for ticket routing, provisioning, onboarding.' },
      { id: 'culture', pillar: 'Organization & Culture', current: 200, target: 300, delta: 100,
        action: 'Build champion network in IT first. Training in context, not generic. Tie AI work to performance reviews.' },
      { id: 'gov',     pillar: 'Governance & Security', current: 300, target: 400, delta: 100,
        action: 'Foundation exists — add agent-specific classification, lifecycle management, ownership. Lowest lift of the gaps.' },
      { id: 'tech',    pillar: 'Technology',           current: 400, target: 400, delta: 0,
        action: 'Already there. The $20M wasn\'t wasted — it built the foundation. Don\'t over-invest here.' }
    ],
    scaleMax: 500,
    insight: 'Woodgrove\'s challenge is no longer technical possibility. It\'s operating discipline. AI Strategy and Business Process are both Δ200 — those are the scale-breakers.'
  }
},

// 11 ------------------------------------------------------------------
{
  id: 'opmodel',
  act: 4, actLabel: 'Act 4 · The Operating Model',
  title: 'The operating model that closes the gaps',
  subtitle: 'CoE journey: centralized → hybrid. Three horizons. Click a horizon for detail.',
  timing: { presentSeconds: 60, discussSeconds: 180 },
  render: 'opmodel',
  config: {
    challenge: 'You\'re Sarah\'s CoE lead. Day one. 90 days to board review. The bet is Workplace & IT Services. What are your first three moves?',
    horizons: [
      {
        id: 'h1', num: 1, title: 'Close foundational gaps', window: '0 → 30 days',
        sections: [
          { title: 'AI Strategy',      body: 'Secure exec sponsors; define service transformation + employee empowerment vision.' },
          { title: 'Business Process', body: 'Map pilot service end-to-end; document baselines; identify top-10 expert bottlenecks.' },
          { title: 'Governance',       body: 'Define agent decision rights; PII policies; connector allow-listing; environment strategy.' },
          { title: 'Org & Culture',    body: 'Identify champions, launch training for experts, run "art of the possible" workshops, onboard service owners.' }
        ]
      },
      {
        id: 'h2', num: 2, title: 'Measure & scale', window: '30 → 60 days',
        sections: [
          { title: 'AI Strategy',      body: 'Service agent live in pilot channel; experience design with human fallback; roadmap for further services.' },
          { title: 'Business Process', body: 'Measure SMART goals — first-contact resolution rate, resolution time, cost per ticket. Service-design workshops for additional services.' },
          { title: 'Governance',       body: 'SLA monitoring dashboard, tested escalation paths, evaluation framework.' },
          { title: 'Org & Culture',    body: 'Hands-on training and hackathons, champions leading office hours and demos, monthly community call.' }
        ]
      },
      {
        id: 'h3', num: 3, title: 'Expand with a proven model', window: '60+ days',
        sections: [
          { title: 'AI Strategy',      body: 'Operating model proven → apply to higher-stakes processes. Expand to where the P&L impact lives — from strength.' },
          { title: 'Business Process', body: 'Standardized service-design workshops to re-imagine workflows end-to-end across business units. Document value case before/after.' },
          { title: 'Governance',       body: 'Agent inventory managed, environment lifecycle automated, scaled from single service to portfolio.' },
          { title: 'Org & Culture',    body: 'CoE transitioning centralized → hybrid (CoE owns platform, service teams own agents). Recognition program live, internal certifications, innovation awards.' }
        ]
      }
    ],
    insight: 'Workplace & IT Services is the proving ground. Once governance, culture, and strategy are proven on internal services, more complex patterns like core business processes become the natural next move.'
  }
},

// 12 ------------------------------------------------------------------
{
  id: 'mirror',
  act: 5, actLabel: 'Act 5 · The Mirror',
  title: 'Woodgrove Bank is fictional.',
  subtitle: '',
  timing: { presentSeconds: 60 },
  render: 'mirror',
  config: {
    forcedPauseMs: 2000,
    line2: 'These numbers are not.',
    stats: [
      { num: '66%', label: 'of leaders say employees are already doing higher-value work with AI', accent: 'blue' },
      { num: '45%', label: 'of leaders say it\'s safer to stay the course than reinvent', accent: 'amber' },
      { num: '13%', label: 'of employees say they feel rewarded for doing AI work', accent: 'pink' }
    ],
    quote: 'The question isn\'t whether AI matters. It\'s whether you\'re willing to redesign your organization around what AI makes possible.',
    quoteAttrib: '— Dr. Karim Lakhani, Harvard Business School · ',
    quoteLink: { text: '2026 Work Trend Index Foreword', href: 'https://www.microsoft.com/en-us/worklab/work-trend-index' }
  }
},

// 13 ------------------------------------------------------------------
{
  id: 'three-decisions',
  act: 5, actLabel: 'Act 5 · The Mirror',
  title: 'Three decisions for your firm',
  subtitle: 'Same diagnostic, different organization. Yours.',
  timing: { presentSeconds: 60, discussSeconds: 240 },
  render: 'three',
  config: {
    selfPrompt: 'Sit with these for a moment. Which one is hardest to answer for your firm right now?',
    decisions: [
      { num: 1, title: 'Which pattern fits your strategy?',
        prompt: 'Looking at your investments — which pattern do they actually point to? Not which you wish, which they describe.' },
      { num: 2, title: 'What gaps do you have to close?',
        prompt: 'Including what you\'ll explicitly deprioritize. Activity is not the same as maturity.' },
      { num: 3, title: 'What operating model do you need?',
        prompt: 'The CoE your pattern requires — not the one you have today.' }
    ]
  }
},

// 14 ------------------------------------------------------------------
{
  id: 'resources',
  act: 5, actLabel: 'Resources',
  title: 'Take the next step',
  subtitle: 'The frameworks — maturity model, transformation patterns, operating model — are all available.',
  timing: { presentSeconds: 60 },
  render: 'resources',
  config: {
    primary: {
      eyebrow: 'Diagnose',
      title: 'Adoption Pulse — Maturity Assessment',
      body: 'The same diagnostic we used for Woodgrove. Score your AI strategy, business process, governance, technology, and culture maturity. Know your gaps before you place your bet.',
      href: 'https://aka.ms/adoptionpulse'
    },
    secondary: {
      eyebrow: 'Engage',
      title: 'Book a Kickstarter workshop',
      body: 'A one-day engagement to coach your team on AI transformation. Build your Frontier Firm Playbook, re-envision work for AI, and create your adoption plan.',
      href: 'https://aka.ms/kickstartme'
    },
    additional: [
      { title: 'Agentic Transformation Patterns', body: 'Detailed guidance for each of the six patterns.', href: 'https://aka.ms/AgenticTransformationPatterns' },
      { title: 'Agentic Maturity Model',          body: 'Deep dive into the maturity pillars with prescriptive guidance.', href: 'https://aka.ms/AgentMaturityModel' },
      { title: 'Agentic CoE Playbook',            body: 'How to stand up a Center of Excellence for agentic AI.',          href: 'https://aka.ms/CAPEAgenticCOEPlaybook' },
      { title: 'Power Up',                        body: 'Hands-on skilling on Microsoft\'s agentic platform.',              href: 'https://aka.ms/powerup' }
    ],
    qr: {
      eyebrow: 'Scan to continue',
      title: 'Copilot Summit hub',
      body: 'Everything from this session — plus the rest of the Copilot Summit toolkit.',
      href: 'https://microsoft.github.io/cat/copilot-summit/index.html',
      image: './images/qr-copilot-summit.svg'
    }
  }
}

];
