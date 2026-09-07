import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, readArchiveRows, readValues, SPREADSHEETS } from './_sheets.js';

const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const last = (rows) => [...rows].reverse().find(filled) || [];
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || last(rows);
const moneyText = (value) => `$${num(value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

function mapRows(rows = []) {
  return Object.fromEntries(rows.filter((row) => row?.[0]).map((row) => [String(row[0]).trim(), row[1]]));
}

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
  if (!value) return new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
  return String(value).replace('T', ' ').replace(/\.\d{3}Z$/, ' UTC');
}

async function safeRead(spreadsheetId, range) {
  try {
    return await readValues(spreadsheetId, range);
  } catch {
    return [];
  }
}

async function buildData() {
  const [actionRows, archiveRows, crmDashboardRows, pipelineRows, trainingRows, kanbanRows, riskRows, decisionRows, readinessRows, financialRows] = await Promise.all([
    readActionRows(),
    readArchiveRows(),
    readValues(SPREADSHEETS.crm, "'CRM Dashboard'!A8:B20"),
    readValues(SPREADSHEETS.crm, "'Prospect Pipeline'!A5:R500"),
    readValues(SPREADSHEETS.training, "'Dashboard'!A4:G25"),
    readValues(SPREADSHEETS.control, "'Kanban Tasks'!A5:M120"),
    readValues(SPREADSHEETS.control, "'Risk Register'!A5:M100"),
    readValues(SPREADSHEETS.control, "'Decision Log'!A5:L140"),
    readValues(SPREADSHEETS.control, "'Launch Readiness'!A5:J60"),
    safeRead(SPREADSHEETS.financial, "'Current Financial View'!A1:D80")
  ]);

  const active = actionRecord(latestOpen(actionRows));
  const actionHistory = [...archiveRows, ...actionRows]
    .filter((row) => filled(row) && String(row[0] || '').trim() !== 'Record ID')
    .map(actionRecord)
    .filter((record) => record.recordId);
  const latestProgress = [...actionHistory].reverse().find((record) => record.followUpNotes || record.closeoutComments || record.savedAt) || active;

  const crm = mapRows(crmDashboardRows);
  const training = mapRows(trainingRows);
  const financial = mapRows(financialRows);
  const prospects = pipelineRows.filter(filled);
  const currentTasks = kanbanRows.filter(filled).filter((row) => !/completed|closed/i.test(row[4] || '')).slice(0, 8);
  const activeRisks = riskRows.filter(filled).filter((row) => !/closed/i.test(row[5] || '')).slice(0, 6);
  const decisions = decisionRows.filter(filled).slice(-10).reverse();
  const professionalGates = readinessRows.filter(filled).filter((row) => /legal|insurance|pricing|account|bank|tax/i.test(`${row[1]} ${row[2]}`)).slice(0, 8);

  const prospectRecords = num(crm['CRM prospect records']) || prospects.length;
  const personalizedContacts = num(crm['Personalized contacts']);
  const discoveryCalls = num(crm['Discovery calls completed']);
  const proposals = num(crm['Proposals sent']);
  const clientsWon = num(crm['Clients won']);
  const activePipeline = num(crm['Active pipeline value']);
  const collectedRevenue = num(crm['Collected revenue']);
  const overdueFollowUps = num(crm['Overdue follow-ups']);

  const wonRows = prospects.filter((row) => /^won/i.test(String(row[6] || '').trim()));
  const cashPayingWins = wonRows.filter((row) => num(row[13]) > 0).length;
  const barterWins = Math.max(0, clientsWon - cashPayingWins);

  const verifiedEligible = num(training['Completed Eligible Hours']);
  const pendingVerification = num(training['Pending Verification Hours']);
  const actualTraining = Number((verifiedEligible + pendingVerification).toFixed(2));
  const remainingActual = Number(Math.max(0, 20 - actualTraining).toFixed(2));

  const augustPlan = num(financial['August original planned revenue']) || 5500;
  const septemberPlan = num(financial['September full-month planned revenue']) || 6050;
  const augustActual = num(financial['August actual collected revenue']);
  const septemberActual = num(financial['September actual collected revenue MTD']);
  const historicalStretch = num(financial['FY1 household-stretch revenue reference']) || 118400;
  const septemberLegacyDraw = num(financial['September required owner draw']) || 3200;
  const augustLegacyDraw = num(financial['August required owner draw (legacy household target)']) || 2850;

  const currentActions = [
    'Convert the nearest qualified cash opportunity to a signed agreement and payment.',
    'Complete the Pastor G proof sample and prepare the exact delivery email for owner approval by September 11.',
    'Prepare and execute the next approved six-prospect outreach wave after owner approval.',
    'Continue ISP-listed SEAP training and preserve actual attendance/completion evidence toward the September 21 final verification.',
    ...currentTasks.map((row) => `${row[0]} — ${row[3]}`)
  ].filter(Boolean).slice(0, 8);

  const alerts = [
    { level: 'critical', message: 'Cash-conversion gate remains triggered: 8 proposals, 1 barter client win, 0 cash-paying wins, and $0 collected cash revenue.' },
    { level: 'warning', message: `SEAP final training verification is due September 21. ${actualTraining.toFixed(2)} actual ISP-listed hours are documented; ${verifiedEligible.toFixed(2)} are verified eligible and ${pendingVerification.toFixed(2)} remain pending explicit verification/acceptance.` },
    { level: 'info', message: 'Business Strategy ES161.2 was submitted September 5 before the September 7 deadline; acceptance remains pending.' },
    { level: 'info', message: 'Podbean is scheduled to renew/downgrade to Unlimited Plus Annual at $348 on September 23; hosting and RSS continuity remain protected.' }
  ];

  return {
    meta: {
      currentFiscalYear: 'FY 2026–27',
      asOf: formatStamp(latestProgress.savedAt || active.savedAt || new Date().toISOString()),
      sourceMode: 'Google Sheets live operating records + Version 2.0 financial controls',
      overallStatus: 'Revenue conversion active; compliance current; cash proof still required',
      statusExplanation: 'The business has launched, the media architecture is live, one barter client relationship is active, and the immediate management test is converting qualified opportunities into collected cash while completing final SEAP training.',
      lastFinancialReconciliation: financial['As of'] || 'Sep 5, 2026'
    },
    financial: {
      actualRevenueToDate: collectedRevenue,
      activeCashPipeline: activePipeline,
      endingBusinessCash: 0,
      actualOwnerDrawToDate: 0,
      cashPayingWins,
      barterWins,
      historicalStretchReference: historicalStretch,
      historicalStretchLabel: 'July 15 household-stretch stress test; not a current sales forecast',
      augustPlan,
      augustActual,
      septemberPlan,
      septemberActual,
      augustLegacyDraw,
      septemberLegacyDraw,
      bridgeNote: 'Unemployment remains household bridge income and is not business revenue. Voice of Liberty is a noncash barter relationship and is not a cash receivable.',
      cashConversionGate: collectedRevenue > 0 ? 'IMPROVING' : 'TRIGGERED'
    },
    pipeline: {
      prospectRecords,
      personalizedContacts,
      discoveryCalls,
      proposals,
      clientsWon,
      cashPayingWins,
      barterWins,
      activeCashPipeline: activePipeline,
      collectedRevenue,
      overdueFollowUps,
      weeklyTargets: {
        personalizedContacts: '10–15',
        followUps: '5+',
        discoveryCalls: '2+',
        proposals: '1+'
      },
      managementNote: 'Revenue first: nearest cash decision, then qualified follow-up, then new personalized outreach. Drafts and research do not count as contacts.'
    },
    training: {
      actualHours: actualTraining,
      verifiedHours: Number(verifiedEligible.toFixed(2)),
      pendingHours: Number(pendingVerification.toFixed(2)),
      remainingActualHours: remainingActual,
      totalRequiredHours: 20,
      finalVerificationDue: 'September 21, 2026',
      note: 'The first ES161.4 package was submitted August 31. NYS DOL acknowledged receipt September 1 but did not explicitly approve each pending hour. Calendar blocks and the September 9 SCORE AI webinar do not count until actual participation and eligibility are supported.'
    },
    compliance: {
      deadlines: [
        { date: 'August 31, 2026', item: 'First 10-hour ES161.4 package', status: 'Submitted; DOL receipt acknowledged September 1; acceptance pending' },
        { date: 'September 5, 2026', item: 'Business Strategy ES161.2', status: 'Submitted before September 7 deadline; acceptance pending' },
        { date: 'September 21, 2026', item: 'Final training verification', status: 'Open; continue ISP-listed training and preserve evidence' },
        { date: 'September 22, 2026', item: 'Stabilization review', status: 'Planned' },
        { date: 'September 23, 2026', item: 'Podbean annual plan change', status: 'Scheduled $348 Unlimited Plus annual renewal/downgrade' }
      ]
    },
    projects: currentTasks.map((row) => `${row[0]} — ${row[3]} (${row[4]}, due ${row[7] || 'not set'})`),
    risks: activeRisks.map((row) => ({ risk: row[2] || row[1] || 'Risk', response: row[7] || row[8] || 'Review required.' })),
    professionalGates: professionalGates.map((row) => ({ name: row[1] || row[2] || 'Professional gate', status: row[5] || 'Open', action: row[8] || row[9] || 'Review required.' })),
    actions: currentActions,
    alerts,
    decisions: decisions.map((row) => `${row[1] || row[0]} — ${row[2] || ''} (${row[7] || row[4] || 'Recorded'})`),
    dataSources: [
      { name: 'Project Control Center', status: 'Live' },
      { name: 'Sales CRM & Outreach Tracker', status: 'Live' },
      { name: 'SEAP Training & Education Log', status: 'Live' },
      { name: 'FY Financial Model V2', status: financialRows.length ? 'Live' : 'Fallback controls active' }
    ],
    recordLinks: [
      { name: 'Project Control Center', url: 'https://docs.google.com/spreadsheets/d/19nKETpDwsD1kw267zcUH6_4bmSTMLsQY79mdfsmYZyU/edit' },
      { name: 'CRM and Prospect Records', url: 'https://docs.google.com/spreadsheets/d/1lVwua0SBfcAJLGnt60n1kEEamKNp-XVMVmnpqdDGbhc/edit' },
      { name: 'Training and Education Log', url: 'https://docs.google.com/spreadsheets/d/1hfMefQV_gISQ6gqZAR5ZG_iXzveGzCumRyfwJplFwM4/edit' },
      { name: 'Financial Model Version 2.0', url: 'https://docs.google.com/spreadsheets/d/1fTuTTGJ-nzRBjdHlfMhAv463Qv1WyfdIhcpJdrpDaNo/edit' }
    ]
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
