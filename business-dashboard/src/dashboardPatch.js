import { dashboardData } from './dashboardData.js';

Object.assign(dashboardData.meta, {
  asOf: 'August 25, 2026 — operating-system update',
  notice: 'Current activity is measured through verified outcomes, pipeline movement, deliverables, cash, compliance, and evidence. Owner business work hours are not tracked. SEAP training duration remains tracked because verified training hours are required.',
});

Object.assign(dashboardData.operatingSnapshot, {
  status: 'Controlled launch and stabilization active',
  phase: 'Revenue, delivery, compliance, training, and operating-control stabilization',
  updateCadence: 'Rolling operating updates as verified business facts change; minimum daily reconciliation',
  lastSync: 'August 25, 2026 — work-time tracking policy update',
  nextSync: 'Next reconciliation after verified deliverables, pipeline changes, training, decisions, cash activity, or blockers are recorded',
  counselorStatus: 'Two SCORE counselor meetings are complete. Protect the August 31 first-training verification, September 7 Business Strategy, and September 21 final-training verification.',
  currentPriorities: [
    'Close the August 31 first 10-hour SEAP training benchmark using the submitted ISP and retained evidence.',
    'Advance the approved add-on architecture without changing the core $550 starter and $1,100 monthly retainer.',
    'Advance legal structure, EIN and banking as applicable, bookkeeping, and insurance controls.',
    'Qualify the next best-fit prospect and prepare first outreach while ongoing prospect work remains in dedicated chats.',
    'Measure business execution through outcomes, pipeline movement, deliverables, cash, compliance, evidence, and next actions rather than owner clock hours.',
  ],
});

dashboardData.executiveCase.proofRequired = 'Paid starter work, recurring retainers, on-time and high-quality delivery, measurable retention, testimonials, referrals, disciplined scope, and monthly cash performance.';

dashboardData.workflow[5][2] = 'Review performance, margin, client value, delivery quality, backlog, and the next engagement.';

const pricingRisk = dashboardData.risks.find((item) => item.risk === 'Launch pricing becomes permanent');
if (pricingRisk) {
  pricingRisk.trigger = 'Scope expands, margin compresses, or client value materially exceeds the launch price.';
  pricingRisk.response = 'Reprice, reduce scope, or discontinue low-value work after validation.';
}

const capacityRisk = dashboardData.risks.find((item) => item.risk === 'Founder capacity overload');
if (capacityRisk) {
  capacityRisk.trigger = 'Backlog grows, deadlines slip, quality declines, or client load exceeds practical control.';
  capacityRisk.response = 'Standardize, narrow scope, protect deadlines, and use project contractors selectively after recurring revenue is proven.';
}

const economicsGate = dashboardData.successGates.find((item) => item[0] === 'Economics');
if (economicsGate) economicsGate[1] = 'Direct costs, margin, scope discipline, and client value remain acceptable.';

const capacityGate = dashboardData.successGates.find((item) => item[0] === 'Capacity');
if (capacityGate) capacityGate[1] = 'Backlog, deadlines, client load, and delivery quality remain under control without service degradation.';

dashboardData.risks.push({
  risk: 'Preparation expands into delayed market validation',
  probability: 3,
  impact: 4,
  trigger: 'Required sales activity is postponed without a documented critical blocker.',
  response: 'Keep preparation subordinate to qualified outreach, discovery, proposals, paid delivery, and collections.',
});

dashboardData.milestones.splice(3, 0,
  { date: 'August 31, 2026', name: 'First training verification due', evidence: 'First 10 hours completed, verified, submitted, and retained.' },
  { date: 'September 21, 2026', name: 'Final training verification due', evidence: 'All 20 hours completed, verified, submitted, and retained.' },
);
