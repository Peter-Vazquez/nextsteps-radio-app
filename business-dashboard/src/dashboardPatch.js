import { dashboardData } from './dashboardData.js';

Object.assign(dashboardData.meta, {
  businessName: 'Next Steps Media & Digital Marketing Services',
  dataMode: 'Current verified operating snapshot plus clearly labeled historical planning baselines',
  asOf: 'September 7, 2026 — operating reconciliation',
  notice: 'Current operating facts replace assumptions as evidence is received. Historical July financial projections remain visible only as planning and household-stress references. Owner business work hours are not tracked. SEAP training duration is tracked only because verified training hours are required.',
});

Object.assign(dashboardData.operatingSnapshot, {
  status: 'Revenue conversion active; compliance milestones current',
  phase: 'Revenue conversion, active barter delivery, final SEAP training, and stabilization',
  outreachStart: 'Active now — qualified follow-up and personalized outreach',
  updateCadence: 'Rolling reconciliation as verified sales, cash, compliance, training, delivery, or risk facts change',
  lastSync: 'September 7, 2026 — revenue, compliance, media-property, and training reconciliation',
  nextSync: 'Next reconciliation after a prospect response, cash event, completed training, DOL response, client-delivery change, or material operating decision',
  qualifiedProspects: 44,
  preliminaryPipelineValue: 2150,
  personalizedContacts: 16,
  discoveryCalls: 3,
  proposals: 8,
  clientsWon: 1,
  trainingLoggedHours: 11.22,
  trainingEligibleHours: 2.00,
  trainingRequiredHours: 20,
  counselorStatus: 'Two SCORE counselor meetings are complete. ES161.2 Business Strategy was submitted September 5 before the September 7 deadline. The first ES161.4 package was submitted August 31 and DOL acknowledged receipt September 1. Final training verification remains due September 21.',
  currentPriorities: [
    'Convert the nearest qualified cash opportunity into a signed agreement and payment; cash proof is the immediate commercial test.',
    'Create the narrow Gospel Light proof sample and prepare its exact delivery email for owner approval by September 11.',
    'Prepare and execute the next approved six-prospect outreach wave without counting research or unsent drafts as contacts.',
    'Continue the submitted-ISP Professional Prospecting and Client Engagement course and preserve actual completion evidence toward the September 21 final verification.',
    'Maintain the Voice of Liberty relationship as an active noncash barter client while keeping barter out of cash revenue and receivables.',
    'Protect current website, podcast, RSS, and media-platform continuity while avoiding unnecessary infrastructure work.',
  ],
  accomplishments: [
    'Version 2.0 of the executable business plan and financial model now governs current operating decisions while the July forecasts remain historical planning baselines.',
    'ES161.2 Business Strategy was signed and submitted September 5 before the September 7 deadline; acceptance remains pending.',
    'The first ES161.4 package was submitted August 31. DOL acknowledged receipt September 1; no deficiency was stated, but pending hours are not treated as explicitly accepted.',
    'MeaningMadeKnown.com now integrates the Media hub, The Next Steps Show, and the Next Steps Radio PODCAST Network while preserving Podpage, Podbean/RSS, Citrus3, and editorial boundaries.',
    'Voice of Liberty is reconciled as an active barter client relationship rather than a cash receivable.',
    'CRM activity now stands at 44 prospect records, 16 personalized contacts, 3 discovery calls, 8 proposals, 1 barter client win, $2,150 active cash pipeline, and $0 collected cash revenue.',
    'Slack is retired. Governing source records, PCC, CRM, financial/training records, and OD Strategy carry the operating evidence.',
  ],
});

dashboardData.executiveCase.solution = 'Next Steps Media & Digital Marketing Services helps clients turn valuable source messages into podcast, web, social, email, and search-ready content through focused production, packaging, repurposing, basic digital visibility, and simple content-performance measurement.';
dashboardData.executiveCase.proofRequired = 'Collected cash from paid starter work or prospect-specific approved engagements, recurring prepaid retainers, on-time and high-quality delivery, measurable client value, referrals, disciplined scope, and repeatable conversion.';

// The two approved launch offers remain the standard commercial architecture.
dashboardData.services = dashboardData.services
  .filter((item) => item.name === 'Message-to-Media Starter' || item.name === 'Content Continuity Retainer')
  .map((item) => item.name === 'Message-to-Media Starter'
    ? { ...item, price: 550, bestFor: 'A defined first paid test', deliverables: 'One source message, edited media, title, description, summary, four social posts, and one revision.', upgrade: 'Convert successful work into the prepaid $1,100 monthly Content Continuity Retainer.' }
    : { ...item, price: 1100, bestFor: 'Consistent monthly execution', deliverables: 'Two content cycles, edits, show notes, social posts, clips or graphics, one web or email content asset, planning call, and one revision.', upgrade: 'Renew monthly while measurable value, scope discipline, and client need support continuation.' });

// July forecast values remain visible only as historical stress-test references.
if (dashboardData.fiscalYears?.[0]) dashboardData.fiscalYears[0].status = 'Historical July household-stretch stress test — not current sales forecast';

// Current proof funnel. A barter client is a valid client win but not a paid starter or cash-paying win.
dashboardData.funnel = [
  { stage: 'CRM prospect records', value: 44, conversion: 100 },
  { stage: 'Personalized contacts', value: 16, conversion: 36.4 },
  { stage: 'Discovery calls', value: 3, conversion: 6.8 },
  { stage: 'Proposals', value: 8, conversion: 18.2 },
  { stage: 'Cash-paying wins', value: 0, conversion: 0 },
];

// Current risk language is outcome-based rather than hour-based.
const pricingRisk = dashboardData.risks.find((item) => item.risk === 'Launch pricing becomes permanent');
if (pricingRisk) {
  pricingRisk.trigger = 'Scope expands, margin compresses, or client value materially exceeds the approved price.';
  pricingRisk.response = 'Reprice prospect-specific work only with explicit approval, reduce scope, or discontinue low-value work. Do not silently change the standard $550/$1,100 offers.';
}

const capacityRisk = dashboardData.risks.find((item) => item.risk === 'Founder capacity overload');
if (capacityRisk) {
  capacityRisk.trigger = 'Backlog grows, deadlines slip, quality declines, or client load exceeds practical control.';
  capacityRisk.response = 'Standardize, narrow scope, protect deadlines, and use project contractors selectively only after recurring cash demand is proven.';
}

const salesRisk = dashboardData.risks.find((item) => item.risk === 'Sales ramp below plan');
if (salesRisk) {
  salesRisk.trigger = 'Qualified activity fails to convert into collected cash; current cash revenue remains $0 despite proposal activity.';
  salesRisk.response = 'Prioritize the nearest cash decision, improve qualification and value proof, follow up on dated opportunities, and continue personalized outreach without broadening the service scope.';
}

const economicsGate = dashboardData.successGates.find((item) => item[0] === 'Economics');
if (economicsGate) economicsGate[1] = 'Collected cash, direct costs, margin, scope discipline, and client value support continuation.';
const capacityGate = dashboardData.successGates.find((item) => item[0] === 'Capacity');
if (capacityGate) capacityGate[1] = 'Backlog, deadlines, client load, and delivery quality remain under control without relying on owner-hour tracking.';
const demandGate = dashboardData.successGates.find((item) => item[0] === 'Demand');
if (demandGate) demandGate[1] = 'Qualified conversations and proposals convert into cash-paying projects and recurring prepaid work; barter alone does not prove cash demand.';

// Replace stale roadmap with the governing current sequence.
dashboardData.milestones = [
  { date: 'August 31, 2026', name: 'First training verification submitted', evidence: 'ES161.4 first 10-hour package submitted at 9:26 PM; 11.22 actual ISP-listed hours documented; DOL receipt acknowledged September 1; acceptance pending.' },
  { date: 'September 5, 2026', name: 'Business Strategy submitted', evidence: 'Signed ES161.2 submitted through NYS DOL Secure Messaging before the September 7 deadline; acceptance pending.' },
  { date: 'September 7, 2026', name: 'Media ecosystem integrated', evidence: 'Meaning Made Known now connects the Media hub, The Next Steps Show, and NSRPN while preserving Podpage, Podbean/RSS, Citrus3, and editorial boundaries.' },
  { date: 'September 7, 2026', name: 'Revenue-conversion week opened', evidence: 'Ken follow-up sent; Pastor G replied with a deferment; proof-sample and next qualified outreach wave are staged for action.' },
  { date: 'September 9, 2026', name: 'Supplemental SCORE AI webinar scheduled', evidence: 'Registration confirmed for 10:00 AM–12:00 PM ET. Do not count hours until actual attendance and eligibility evidence exist.' },
  { date: 'September 21, 2026', name: 'Final training verification due', evidence: 'Complete remaining ISP-listed training, preserve evidence, submit final verification, and distinguish actual, verified, and pending hours.' },
  { date: 'September 22, 2026', name: 'Stabilization review', evidence: 'Review cash conversion, pipeline, delivery, compliance, training, scope discipline, and corrective actions before service expansion.' },
  { date: 'September 23, 2026', name: 'Podbean annual plan change', evidence: 'Scheduled downgrade/renewal to Unlimited Plus Annual at $348 while protecting hosting and RSS continuity.' },
];

// Keep owner business work-time tracking disabled.
delete dashboardData.operatingSnapshot.confirmedWorkHours;
delete dashboardData.operatingSnapshot.currentWeekConfirmedHours;
delete dashboardData.operatingSnapshot.pendingTimeEntries;
