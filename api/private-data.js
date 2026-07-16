import { configured, isAuthenticated, json } from './_auth.js';

const safeDefault = {
  meta: {
    currentFiscalYear: 'FY 2026–27',
    asOf: 'July 15, 2026',
    sourceMode: 'Secure approved snapshot',
    overallStatus: 'Pre-launch — customer proof required',
    statusExplanation: 'The plan, model, controls, and offers are established. Customer and revenue validation remain the decisive proof.',
  },
  financial: {
    plannedRevenueToDate: 0,
    actualRevenueToDate: 0,
    requiredOwnerDrawToDate: 0,
    actualOwnerDrawToDate: 0,
    outsideIncomeUsed: 0,
    endingCash: 0,
    minimumCashReserve: 5000,
    monthly: [
      { month: 'Aug', plan: 5500, actual: null, requiredDraw: 2850, actualDraw: null },
      { month: 'Sep', plan: 6050, actual: null, requiredDraw: 3200, actualDraw: null },
      { month: 'Oct', plan: 6600, actual: null, requiredDraw: 3550, actualDraw: null },
      { month: 'Nov', plan: 7500, actual: null, requiredDraw: 3900, actualDraw: null },
      { month: 'Dec', plan: 9250, actual: null, requiredDraw: 4250, actualDraw: null },
      { month: 'Jan', plan: 9250, actual: null, requiredDraw: 4600, actualDraw: null },
      { month: 'Feb', plan: 10750, actual: null, requiredDraw: 4950, actualDraw: null },
      { month: 'Mar', plan: 10750, actual: null, requiredDraw: 5300, actualDraw: null },
      { month: 'Apr', plan: 11500, actual: null, requiredDraw: 5650, actualDraw: null },
      { month: 'May', plan: 13250, actual: null, requiredDraw: 6000, actualDraw: null },
      { month: 'Jun', plan: 13250, actual: null, requiredDraw: 6250, actualDraw: null },
      { month: 'Jul', plan: 14750, actual: null, requiredDraw: 6550, actualDraw: null }
    ]
  },
  pipeline: {
    qualifiedProspects: 0,
    contacted: 0,
    discoveryCalls: 0,
    proposals: 0,
    paidStarters: 0,
    activeRetainers: 0,
    currentMonthRetainerTarget: 3,
    retainerTarget: 9,
    weeklyTargets: {
      qualifiedProspects: '10–15',
      personalizedContacts: '10–15',
      followUps: '5+',
      callsScheduled: '2+',
      callsCompleted: '1–2',
      proposals: '1+'
    },
    managementNote: 'The pipeline has not yet produced customer proof. Outreach and discovery work must begin before launch rather than after it.'
  },
  training: {
    loggedHours: 2.98,
    verifiedHours: 1.98,
    totalRequiredHours: 20,
    note: 'Training eligibility remains subject to SEAP verification. Logged time is not automatically treated as approved training.'
  },
  compliance: {
    deadlines: [
      { date: 'Aug. 10, 2026', item: 'Individual Services Plan', status: 'Open' },
      { date: 'Aug. 24, 2026', item: 'Individual Progress Report', status: 'Open' },
      { date: 'Aug. 31, 2026', item: 'First 10 training hours verification', status: 'Open' },
      { date: 'Sep. 7, 2026', item: 'Business Strategy', status: 'Open' },
      { date: 'Sep. 21, 2026', item: 'Final 10 training hours verification', status: 'Open' },
      { date: 'Before Sep. 7', item: 'Two business-counselor meetings', status: 'Open' }
    ]
  },
  professionalGates: [
    { name: 'Attorney review', status: 'Pending', action: 'Entity, agreement, IP, releases, confidentiality, privacy, AI-use disclosure, and station references.' },
    { name: 'CPA / tax review', status: 'Pending', action: 'Books, tax year, entity treatment, sales tax, estimated taxes, and deductions.' },
    { name: 'Insurance review', status: 'Pending', action: 'General liability, E&O, cyber, and equipment coverage.' },
    { name: 'Cybersecurity review', status: 'Pending', action: 'Credentials, sensitive data, backups, access control, and incident readiness.' },
    { name: 'SCORE / VBOC / SBDC review', status: 'Pending', action: 'External challenge, validation, and accountability.' }
  ],
  actions: [
    'Build the first 40-prospect qualification list and record every contact in the CRM.',
    'Schedule at least two discovery conversations each week.',
    'Complete the client agreement and professional review gates before accepting complex work.',
    'Confirm the first SEAP counselor meeting and training-verification path.',
    'Enter financial actuals monthly and quantify any outside-income bridge immediately.',
    'Raise pricing when delivery value and scope exceed launch assumptions.'
  ],
  alerts: [
    { level: 'high', message: 'Customer and revenue validation are not yet established.' },
    { level: 'medium', message: 'Only 1.98 training hours are currently treated as verified or eligible.' },
    { level: 'medium', message: 'Professional legal, tax, insurance, and cybersecurity reviews remain open.' },
    { level: 'low', message: 'The public dashboard contains no account-level or client-identifying data.' }
  ],
  dataSources: [
    { name: 'FY financial model', status: 'Approved snapshot' },
    { name: 'CRM', status: 'Manual totals pending' },
    { name: 'Project Control Center', status: 'Established' },
    { name: 'Training log', status: 'Established' },
    { name: 'Bank and accounting actuals', status: 'Not connected' },
    { name: 'Private client records', status: 'Excluded from browser app' }
  ]
};

function loadData() {
  if (!process.env.PRIVATE_DASHBOARD_DATA_JSON) return safeDefault;
  try {
    return JSON.parse(process.env.PRIVATE_DASHBOARD_DATA_JSON);
  } catch {
    return {
      ...safeDefault,
      meta: {
        ...safeDefault.meta,
        overallStatus: 'Secure data configuration error',
        statusExplanation: 'PRIVATE_DASHBOARD_DATA_JSON could not be parsed. The safe default snapshot is displayed instead.'
      }
    };
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure portal is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  return json(res, 200, loadData());
}
