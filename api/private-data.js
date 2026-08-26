import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, readArchiveRows, readValues, SPREADSHEETS } from './_sheets.js';

const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const last = (rows) => [...rows].reverse().find(filled) || [];
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || last(rows);
const plural = (value, singular, pluralForm = `${singular}s`) => `${value} ${value === 1 ? singular : pluralForm}`;

function actionRecord(row = []) {
  return {
    recordId: row[0] || '',
    date: row[1] || '',
    status: row[2] || '',
    objective: row[3] || '',
    contactsSent: num(row[11]),
    responses: num(row[12]),
    meetingsSet: num(row[13]),
    followUpNotes: row[15] || '',
    closeoutComments: row[16] || '',
    tomorrowFirstAction: row[17] || '',
    savedAt: row[18] || '',
    closedAt: row[19] || ''
  };
}

function formatStamp(value) {
  if (!value) return new Date().toISOString();
  return String(value).replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

async function buildData() {
  const [actionRows, archiveRows, pipelineRows, outreachRows, discoveryRows, proposalRows, trainingRows, kanbanRows, riskRows, decisionRows, readinessRows] = await Promise.all([
    readActionRows(),
    readArchiveRows(),
    readValues(SPREADSHEETS.crm, "'Prospect Pipeline'!A5:R500"),
    readValues(SPREADSHEETS.crm, "'Outreach Log'!A5:M500"),
    readValues(SPREADSHEETS.crm, "'Discovery Calls'!A5:O500"),
    readValues(SPREADSHEETS.crm, "'Proposals'!A5:L500"),
    readValues(SPREADSHEETS.training, "'Dashboard'!A4:G12"),
    readValues(SPREADSHEETS.control, "'Kanban Tasks'!A5:M100"),
    readValues(SPREADSHEETS.control, "'Risk Register'!A5:M80"),
    readValues(SPREADSHEETS.control, "'Decision Log'!A5:L100"),
    readValues(SPREADSHEETS.control, "'Launch Readiness'!A5:J40")
  ]);

  const active = actionRecord(latestOpen(actionRows));
  const actionHistory = [...archiveRows, ...actionRows]
    .filter((row) => filled(row) && String(row[0] || '').trim() !== 'Record ID')
    .map(actionRecord)
    .filter((record) => record.recordId);

  const cumulative = actionHistory.reduce((total, record) => ({
    contactsSent: total.contactsSent + record.contactsSent,
    responses: total.responses + record.responses,
    meetingsSet: total.meetingsSet + record.meetingsSet
  }), { contactsSent: 0, responses: 0, meetingsSet: 0 });

  const latestProgress = [...actionHistory].reverse().find((record) =>
    record.contactsSent || record.responses || record.meetingsSet || record.followUpNotes || record.closeoutComments
  ) || active;

  const prospects = pipelineRows.filter(filled);
  const outreach = outreachRows.filter(filled);
  const discovery = discoveryRows.filter(filled);
  const proposals = proposalRows.filter(filled);
  const trainingMap = Object.fromEntries(trainingRows.filter((row) => row[0]).map((row) => [row[0], row[1]]));
  const currentTasks = kanbanRows.filter(filled).filter((row) => !/completed/i.test(row[4] || '')).slice(0, 6);
  const activeRisks = riskRows.filter(filled).filter((row) => !/closed/i.test(row[5] || '')).slice(0, 5);
  const decisions = decisionRows.filter(filled).slice(-8).reverse();
  const professionalGates = readinessRows.filter(filled).filter((row) => /legal|insurance|pricing/i.test(`${row[1]} ${row[2]}`));

  const uniqueProspectsContacted = prospects.filter((row) => row[9]).length;
  const currentlyScheduled = prospects.filter((row) => /discovery scheduled/i.test(row[6] || '')).length;
  const preliminaryValue = prospects.reduce((sum, row) => sum + num(row[13]), 0);
  const collectedRevenue = proposals.reduce((sum, row) => sum + num(row[10]), 0);
  const eligibleTraining = num(trainingMap['Completed Eligible Hours']);
  const pendingTraining = num(trainingMap['Pending Verification Hours']);
  const totalTraining = eligibleTraining + pendingTraining;
  const discoveryScheduled = Math.max(cumulative.meetingsSet, currentlyScheduled);

  const currentActions = [
    active.tomorrowFirstAction,
    ...currentTasks.map((row) => row[3])
  ].filter(Boolean).slice(0, 7);

  return {
    meta: {
      currentFiscalYear: 'FY 2026–27',
      asOf: formatStamp(active.savedAt || latestProgress.savedAt),
      overallStatus: `Operating cumulative — ${plural(cumulative.contactsSent, 'contact')}, ${plural(cumulative.responses, 'response')}, ${plural(discoveryScheduled, 'meeting')} scheduled`,
      cumulativeNarrative: `Launch progress to date includes ${prospects.length} qualified prospects representing $${preliminaryValue.toLocaleString('en-US')} in preliminary opportunity value, ${cumulative.contactsSent} personalized contacts, ${cumulative.responses} responses, ${discoveryScheduled} meeting scheduled, and ${totalTraining.toFixed(2)} SEAP training hours logged or pending verification. Business work hours are intentionally not tracked; execution is measured through outcomes, pipeline movement, deliverables, cash, compliance, and retained evidence.`,
      statusExplanation: `Current priority: ${active.objective || active.tomorrowFirstAction || 'Continue the documented launch plan.'}`,
      syncSource: 'Google Sheets cumulative live sync'
    },
    financial: {
      actualRevenueToDate: collectedRevenue,
      actualExpensesToDate: 0,
      endingCash: collectedRevenue,
      actualOwnerDrawToDate: 0,
      requiredOwnerDrawToDate: 0,
      outsideIncomeUsed: 0,
      bridgeNote: 'Financial actuals are cumulative and remain zero until transactions are recorded.',
      monthly: [
        { month: 'Aug', plan: 5500, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Sep', plan: 6050, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Oct', plan: 6600, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Nov', plan: 7500, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Dec', plan: 9250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Jan', plan: 9250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Feb', plan: 10750, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Mar', plan: 10750, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Apr', plan: 11500, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'May', plan: 13250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Jun', plan: 13250, actual: 0, expenses: 0, actualDraw: 0 },
        { month: 'Jul', plan: 14750, actual: 0, expenses: 0, actualDraw: 0 }
      ]
    },
    pipeline: {
      qualifiedProspects: prospects.length,
      preliminaryValue,
      contactsSent: cumulative.contactsSent,
      contacted: uniqueProspectsContacted,
      responses: cumulative.responses,
      discoveryScheduled,
      discoveryCalls: discovery.length,
      proposals: proposals.length,
      paidStarters: prospects.filter((row) => /^won$/i.test(row[6] || '')).length,
      activeRetainers: prospects.filter((row) => /retainer/i.test(row[6] || '')).length,
      currentActions
    },
    workload: {
      trackingMode: 'Outcome-based; owner business work hours are not tracked.',
      activeRecordStatus: active.status || '',
      latestOutcome: latestProgress.closeoutComments || '',
      capacityStatus: 'Capacity is monitored through backlog, deadlines, delivery quality, client load, scope, and cash performance rather than owner clock hours.'
    },
    training: {
      loggedHours: Number(totalTraining.toFixed(2)),
      eligibleHours: Number(eligibleTraining.toFixed(2)),
      pendingHours: Number(pendingTraining.toFixed(2)),
      remainingHours: Number(Math.max(0, 20 - totalTraining).toFixed(2)),
      totalRequiredHours: 20
    },
    projects: currentTasks.map((row) => `${row[0]} — ${row[3]} (${row[4]}, due ${row[7] || 'not set'})`),
    risks: activeRisks.map((row) => ({ risk: row[2], response: row[7] || row[8] || 'Review required.' })),
    compliance: {
      deadlines: [
        { date: 'August 10, 2026', item: 'Individual Services Plan', status: 'Completed' },
        { date: 'August 24, 2026', item: 'Individual Progress Report', status: 'Submitted August 23' },
        { date: 'August 31, 2026', item: 'First ten training hours verification', status: eligibleTraining >= 10 ? 'Ready' : 'Open' },
        { date: 'September 7, 2026', item: 'Business Strategy', status: 'Open — two counselor meetings completed' },
        { date: 'September 21, 2026', item: 'Final training verification', status: eligibleTraining >= 20 ? 'Ready' : 'Open' }
      ]
    },
    professionalGates: professionalGates.map((row) => ({ name: row[1], status: row[5], action: row[8] || row[9] || 'Review required.' })),
    actions: currentActions,
    decisions: decisions.map((row) => `${row[1]} — ${row[2]} (${row[7] || 'Status not set'})`),
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
    return json(res, 200, await buildData());
  } catch (error) {
    return json(res, 500, { message: error.message || 'Live dashboard data could not be loaded.' });
  }
}
