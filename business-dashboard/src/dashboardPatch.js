import { dashboardData } from './dashboardData.js';

Object.assign(dashboardData.meta, {
  asOf: 'July 16, 2026 — afternoon management update',
});

Object.assign(dashboardData.operatingSnapshot, {
  status: 'Preparation period active — outreach scheduled for Monday',
  phase: 'Pre-launch offer, systems, training, and readiness preparation',
  outreachStart: 'Monday, July 20, 2026',
  updateCadence: 'Morning operating plan and end-of-day actuals; minimum one complete update every active workday',
  lastSync: 'July 16, 2026 — afternoon management decision and accountability update',
  nextSync: 'End-of-day closeout after actual hours, completed work, training, decisions, and blockers are recorded',
  counselorStatus: 'SCORE mentor request and VBOC outreach submitted; responses pending. Two counselor meetings must be completed before the September 7 Business Strategy submission.',
  currentPriorities: [
    'Complete the business concept statement: customer, problem, solution, difference, and proof required.',
    'Freeze the $550 starter-project scope and $1,100 monthly-retainer scope, including exclusions, turnaround, client responsibilities, revisions, and payment controls.',
    'Complete the discovery guide, proposal structure, agreement-review questions, invoice process, and complete client journey.',
    'Run one mock client from discovery through delivery and document production, quality, legal, insurance, payment, privacy, and cybersecurity gaps.',
    'Prepare the first five personalized outreach contacts, contact routes, specific client needs, and follow-up dates for Monday.',
    'Advance the Individual Services Plan, training schedule, counselor follow-up, and SEAP evidence folder.',
    'Update the online dashboard morning and end-of-day, with a minimum of one complete update every active workday.',
  ],
  accomplishments: [
    ...dashboardData.operatingSnapshot.accomplishments,
    'Outreach start formally scheduled for Monday, July 20, after a controlled preparation period rather than an improvised launch.',
    'Twice-daily dashboard accountability standard adopted for family, owner, advisor, and startup oversight.',
  ],
});

dashboardData.risks.push({
  risk: 'Preparation expands into delayed market validation',
  probability: 3,
  impact: 4,
  trigger: 'Monday outreach is postponed without a documented critical blocker.',
  response: 'Time-box preparation, use readiness criteria, and begin the controlled five-contact outreach wave on July 20.',
});

dashboardData.milestones.unshift(
  { date: 'July 19, 2026', name: 'Preparation readiness checkpoint', evidence: 'Offer, discovery process, outreach messages, mock-client workflow, SEAP work, and Monday contact packet reviewed.' },
);

dashboardData.milestones.splice(3, 0,
  { date: 'August 10, 2026', name: 'Individual Services Plan due', evidence: 'Completed form submitted and confirmation retained.' },
  { date: 'August 31, 2026', name: 'First training verification due', evidence: 'First 10 hours completed, verified, submitted, and retained.' },
  { date: 'September 21, 2026', name: 'Final training verification due', evidence: 'All 20 hours completed, verified, submitted, and retained.' },
);
