import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, readArchiveRows, readValues, SPREADSHEETS } from './_sheets.js';

const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const last = (rows) => [...rows].reverse().find(filled) || [];
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || last(rows);
const formatStamp = (value) => value ? String(value).replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC') : new Date().toISOString();
const plural = (value, singular, pluralForm = `${singular}s`) => `${value} ${value === 1 ? singular : pluralForm}`;

function actionRecord(row = []) {
  let taskStatus = {};
  try { taskStatus = JSON.parse(row[10] || '{}'); } catch { taskStatus = {}; }
  return {
    recordId: row[0] || '', date: row[1] || '', status: row[2] || '', objective: row[3] || '',
    plannedStart: row[4] || '', plannedEnd: row[5] || '', actualStart: row[6] || '', actualEnd: row[7] || '',
    breakMinutes: num(row[8]), workHours: num(row[9]), taskStatus,
    contactsSent: num(row[11]), responses: num(row[12]), meetingsSet: num(row[13]), prospectingHours: num(row[14]),
    followUpNotes: row[15] || '', closeoutComments: row[16] || '', tomorrowFirstAction: row[17] || '',
    savedAt: row[18] || '', closedAt: row[19] || ''
  };
}

function staticOperatingCase() {
  return {
    purpose: [
      ['Problem', 'Important messages are underused because organizations lack time, systems, or in-house production capacity.'],
      ['Solution', 'One source message becomes professional podcast, web, social, email, and search content.'],
      ['Customer', 'Small businesses, nonprofits, ministries, professional services, public voices, creators, and community organizations.'],
      ['Proof required', 'Paid starter work, recurring retainers, disciplined delivery hours, testimonials, referrals, and dependable cash performance.']
    ],
    services: [
      ['Message-to-Media Starter', 550, 'First paid test', 'One source message, edited media, title, description, summary, four social posts, and one revision.'],
      ['Content Continuity Retainer', 1100, 'Monthly execution', 'Two content cycles, edits, show notes, social posts, clips or graphics, one web or email asset, planning call, and one revision.']
    ],
    market: [
      ['Primary launch market', 'Warm-network nonprofits, ministries, professional-service owners, prior guests, veteran-owned organizations, and trusted referrals.'],
      ['Operating advantage', 'Founder access, broadcast discipline, executive judgment, owned workspace, regional credibility, and integrated content delivery.'],
      ['Capacity discipline', 'Growth is constrained by delivery quality and owner capacity, not by the total number of organizations in the region.'],
      ['Validation standard', 'Demand is proven through qualified conversations, paid projects, repeat delivery, retainer conversion, and collected cash.']
    ],
    beachhead: 'Begin with warm-network nonprofits, ministries, professional-service owners, prior guests, veteran relationships, and trusted referrals. Expansion follows proof, not enthusiasm.',
    growth: [
      ['1. Prove demand', 'Complete qualified outreach, discovery calls, proposals, paid starter projects, and customer interviews.'],
      ['2. Prove delivery', 'Deliver the same standardized scope more than once, within planned hours and quality controls.'],
      ['3. Prove recurring value', 'Convert successful starter projects into prepaid monthly retainers and referrals.'],
      ['4. Expand selectively', 'Add pricing, capacity, contractors, tools, or secondary services only after cash, quality, and demand justify them.']
    ],
    milestones: [
      ['July 21, 2026', 'First outreach and sales-system checkpoint', 'Three contacts sent, two positive responses received, one meeting scheduled, client-ready materials completed, and SBA Journey 9 applied to the Sales SOP.'],
      ['August 1, 2026', 'Controlled soft launch', 'Offers, CRM, payment method, client controls, and production workflow ready.'],
      ['August 10, 2026', 'Individual Services Plan due', 'Completed form submitted and confirmation retained.'],
      ['August 31, 2026', 'First training verification due', 'First ten hours completed, verified, submitted, and retained.'],
      ['September 7, 2026', 'Business Strategy due', 'Strategy submitted after two counselor meetings.'],
      ['September 21, 2026', 'Final training verification due', 'All twenty hours completed, verified, submitted, and retained.']
    ]
  };
}

async function buildData() {
  const [actionRows, archiveRows, controlMetrics, kanban, risks, decisions, readiness, scorecard, pipelineRows, outreachRows, discoveryRows, proposalRows, workRows, trainingRows] = await Promise.all([
    readActionRows(),
    readArchiveRows(),
    readValues(SPREADSHEETS.control, "'Control Dashboard'!A5:H12"),
    readValues(SPREADSHEETS.control, "'Kanban Tasks'!A5:M100"),
    readValues(SPREADSHEETS.control, "'Risk Register'!A5:M80"),
    readValues(SPREADSHEETS.control, "'Decision Log'!A5:L100"),
    readValues(SPREADSHEETS.control, "'Launch Readiness'!A5:J40"),
    readValues(SPREADSHEETS.control, "'Weekly Scorecard'!A5:Q30"),
    readValues(SPREADSHEETS.crm, "'Prospect Pipeline'!A5:R500"),
    readValues(SPREADSHEETS.crm, "'Outreach Log'!A5:M500"),
    readValues(SPREADSHEETS.crm, "'Discovery Calls'!A5:O500"),
    readValues(SPREADSHEETS.crm, "'Proposals'!A5:L500"),
    readValues(SPREADSHEETS.workLog, "'Daily Work Log'!A5:M1000"),
    readValues(SPREADSHEETS.training, "'Dashboard'!A4:G12")
  ]);

  const active = actionRecord(latestOpen(actionRows));
  const actionHistory = [...archiveRows, ...actionRows]
    .filter((row) => filled(row) && String(row[0] || '').trim() !== 'Record ID')
    .map(actionRecord)
    .filter((record) => record.recordId);
  const cumulativeActivity = actionHistory.reduce((total, record) => ({
    contactsSent: total.contactsSent + record.contactsSent,
    responses: total.responses + record.responses,
    meetingsSet: total.meetingsSet + record.meetingsSet,
    prospectingHours: total.prospectingHours + record.prospectingHours,
    workHours: total.workHours + record.workHours,
    breakMinutes: total.breakMinutes + record.breakMinutes
  }), { contactsSent: 0, responses: 0, meetingsSet: 0, prospectingHours: 0, workHours: 0, breakMinutes: 0 });
  const latestProgress = [...actionHistory].reverse().find((record) =>
    record.contactsSent || record.responses || record.meetingsSet || record.workHours || record.followUpNotes || record.closeoutComments
  ) || active;

  const prospects = pipelineRows.filter(filled);
  const outreach = outreachRows.filter(filled);
  const discovery = discoveryRows.filter(filled);
  const proposals = proposalRows.filter(filled);
  const work = workRows.filter(filled);
  const weekly = last(scorecard.filter(filled));
  const trainingMap = Object.fromEntries(trainingRows.filter((row) => row[0]).map((row) => [row[0], row[1]]));

  const uniqueProspectsContacted = prospects.filter((row) => row[9]).length;
  const currentlyScheduled = prospects.filter((row) => /discovery scheduled/i.test(row[6] || '')).length;
  const won = prospects.filter((row) => /^won$/i.test(row[6] || '')).length;
  const activeRetainers = prospects.filter((row) => /retainer/i.test(row[6] || '')).length;
  const preliminaryValue = prospects.reduce((sum, row) => sum + num(row[13]), 0);
  const collectedRevenue = proposals.reduce((sum, row) => sum + num(row[10]), 0);
  const confirmedHours = work.reduce((sum, row) => sum + num(row[5]), 0);
  const eligibleTraining = num(trainingMap['Completed Eligible Hours']);
  const pendingTraining = num(trainingMap['Pending Verification Hours']);
  const totalLoggedTraining = eligibleTraining + pendingTraining;
  const currentTasks = kanban.filter(filled).filter((row) => !/completed/i.test(row[4] || '')).slice(0, 6);
  const activeRisks = risks.filter(filled).filter((row) => !/closed/i.test(row[5] || '')).slice(0, 6);
  const currentDecisions = decisions.filter(filled).slice(-8).reverse();
  const readinessRows = readiness.filter(filled);
  const green = readinessRows.filter((row) => /green/i.test(row[5] || '')).length;
  const readinessScore = readinessRows.length ? Math.round((green / readinessRows.length) * 100) : 0;

  const currentActions = [
    active.tomorrowFirstAction,
    active.followUpNotes,
    ...currentTasks.map((row) => row[3])
  ].filter(Boolean).slice(0, 7);

  return {
    meta: {
      currentFiscalYear: 'FY 2026–27',
      asOf: active.savedAt ? formatStamp(active.savedAt) : latestProgress.savedAt ? formatStamp(latestProgress.savedAt) : `live spreadsheet sync — ${new Date().toISOString()}`,
      overallStatus: `Pre-launch cumulative — ${plural(cumulativeActivity.contactsSent, 'contact')}, ${plural(cumulativeActivity.responses, 'response')}, ${plural(cumulativeActivity.meetingsSet, 'meeting')} scheduled`,
      statusExplanation: `Cumulative operating totals are preserved across closed and active days. Current priority: ${active.objective || active.tomorrowFirstAction || latestProgress.followUpNotes || 'Continue the documented launch plan.'}`,
      syncSource: 'Google Sheets cumulative live sync',
      activeRecordId: active.recordId,
      readinessScore,
      presentationMode: 'Cumulative-to-date'
    },
    financial: {
      actualRevenueToDate: collectedRevenue,
      actualExpensesToDate: 0,
      endingCash: collectedRevenue,
      actualOwnerDrawToDate: 0,
      requiredOwnerDrawToDate: 0,
      outsideIncomeUsed: 0,
      bridgeNote: 'Financial actuals are cumulative and read from the CRM proposal and collection records. Expense and owner-draw integrations remain zero until transactions are recorded.',
      monthly: [
        { month: 'Aug', plan: 5500, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'Sep', plan: 6050, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Oct', plan: 6600, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'Nov', plan: 7500, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Dec', plan: 9250, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'Jan', plan: 9250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Feb', plan: 10750, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'Mar', plan: 10750, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Apr', plan: 11500, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'May', plan: 13250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Jun', plan: 13250, actual: 0, expenses: 0, actualDraw: 0 }, { month: 'Jul', plan: 14750, actual: 0, expenses: 0, actualDraw: 0 }
      ],
      annualPlans: [
        ['FY 2026–27', 118400, 57050, 19844, 'Required operating target'], ['FY 2027–28', 174000, 84300, 42788, 'Household-supporting base case'],
        ['FY 2028–29', 228000, 99000, 70796, 'Pricing and service expansion'], ['FY 2029–30', 262800, 117000, 91023, 'Mature premium practice'],
        ['FY 2030–31', 325800, 138000, 115571, 'Selective scale']
      ]
    },
    pipeline: {
      qualifiedProspects: prospects.length,
      preliminaryValue,
      contactsSent: cumulativeActivity.contactsSent,
      contacted: uniqueProspectsContacted,
      responses: cumulativeActivity.responses,
      discoveryScheduled: Math.max(cumulativeActivity.meetingsSet, currentlyScheduled),
      discoveryCalls: discovery.length,
      proposals: proposals.length,
      paidStarters: won,
      activeRetainers,
      prospectingHours: Number(cumulativeActivity.prospectingHours.toFixed(2)),
      weeklyContacts: num(weekly[2]),
      currentActions
    },
    operatingCase: staticOperatingCase(),
    projects: currentTasks.map((row) => `${row[0]} — ${row[3]} (${row[4]}, due ${row[7] || 'not set'})`),
    workload: {
      confirmedHours: Number(confirmedHours.toFixed(2)),
      actionSheetHours: Number(cumulativeActivity.workHours.toFixed(2)),
      cumulativeBreakMinutes: cumulativeActivity.breakMinutes,
      pendingEntries: active.actualStart && !active.actualEnd ? 1 : 0,
      capacityStatus: active.actualStart && !active.actualEnd
        ? `The ${active.date || 'current'} workday is open. Start: ${active.actualStart}; breaks: ${active.breakMinutes}; final hours remain pending closeout.`
        : `Cumulative confirmed startup hours are shown above. ${latestProgress.closeoutComments || 'The latest completed operating record is preserved in the archive.'}`
    },
    training: {
      loggedHours: Number(totalLoggedTraining.toFixed(2)),
      eligibleHours: Number(eligibleTraining.toFixed(2)),
      pendingHours: Number(pendingTraining.toFixed(2)),
      remainingHours: Number(Math.max(0, 20 - totalLoggedTraining).toFixed(2)),
      totalRequiredHours: 20
    },
    risks: activeRisks.map((row) => ({ risk: row[2], response: row[7] || row[8] || 'Review required.' })),
    compliance: {
      deadlines: [
        { date: 'August 10, 2026', item: 'Individual Services Plan', status: 'Open' },
        { date: 'August 24, 2026', item: 'Individual Progress Report', status: 'Open' },
        { date: 'August 31, 2026', item: 'First ten training hours verification', status: eligibleTraining >= 10 ? 'Ready' : 'Open' },
        { date: 'September 7, 2026', item: 'Business Strategy', status: 'Open — two counselor meetings required first' },
        { date: 'September 21, 2026', item: 'Final training verification', status: eligibleTraining >= 20 ? 'Ready' : 'Open' }
      ]
    },
    professionalGates: readinessRows.filter((row) => /legal|insurance|pricing/i.test(`${row[1]} ${row[2]}`)).map((row) => ({ name: row[1], status: row[5], action: row[8] || row[9] || 'Review required.' })),
    actions: currentActions,
    decisions: currentDecisions.map((row) => `${row[1]} — ${row[2]} (${row[7] || 'Status not set'})`),
    controlMetrics: controlMetrics.filter(filled).map((row) => ({ metric: row[0], current: row[1], target: row[2] })),
    outreachCount: outreach.length,
    recordLinks: [
      { name: 'Project Control Center', url: 'https://docs.google.com/spreadsheets/d/19nKETpDwsD1kw267zcUH6_4bmSTMLsQY79mdfsmYZyU/edit' },
      { name: 'Daily Work Log', url: 'https://docs.google.com/spreadsheets/d/1GSJyMOu10lqLnfqEW87BElRRClYrFdRvsbZmRrsiDVQ/edit' },
      { name: 'CRM and Prospect Records', url: 'https://docs.google.com/spreadsheets/d/1lVwua0SBfcAJLGnt60n1kEEamKNp-XVMVmnpqdDGbhc/edit' },
      { name: 'Training and Education Log', url: 'https://docs.google.com/spreadsheets/d/1hfMefQV_gISQ6gqZAR5ZG_iXzveGzCumRyfwJplFwM4/edit' }
    ],
    approvedDocuments: []
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return json(res, 200, await buildData());
  } catch (error) {
    return json(res, 500, { message: error.message || 'Live dashboard data could not be loaded.' });
  }
}