import { configured, isAuthenticated, json } from './_auth.js';

const safeDefault = {
  meta: {
    currentFiscalYear: 'FY 2026–27',
    asOf: 'July 16, 2026 — evening infrastructure update',
    overallStatus: 'Pre-launch — live platform established; customer proof required',
    statusExplanation:
  		'The standalone public and private accountability platform is live at odstrategy.com. Authentication, HTTPS, custom domains, branch separation, legacy-deployment retirement, and radio-app protection have been verified. Outreach, paid customer validation, and collected revenue remain the decisive proof.'
  },

  financial: {
    actualRevenueToDate: 0,
    actualExpensesToDate: 0,
    endingCash: 0,
    actualOwnerDrawToDate: 0,
    requiredOwnerDrawToDate: 0,
    outsideIncomeUsed: 0,
    bridgeNote:
      'The first fiscal year begins August 1, 2026. Actual revenue, expenses, owner draw, cash, and household-income bridge amounts will be entered as transactions occur.',
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
    qualifiedProspects: 40,
    contacted: 0,
    discoveryCalls: 0,
    proposals: 0,
    paidStarters: 0,
    activeRetainers: 0,
    currentActions: [
      'Complete final outreach preparation before Monday, July 20.',
      'Prioritize the first ten nonpolitical warm-network prospects.',
      'Prepare personalized opening messages and discovery questions.',
      'Record every contact, response, next action, and follow-up date in the CRM.',
      'Maintain a maximum first-wave mix of approximately five campaign prospects.'
    ]
  },

  projects: [
    'Standalone OD Strategy Vercel project created.',
    'Production branch changed to odstrategy-dashboard.',
    'Root directory isolated to the odstrategy-dashboard folder.',
    'Dreamweaver and GitHub Desktop editing workflow validated.',
    'Public dashboard deployed successfully.',
    'Private shared-dashboard authentication and data loading under final testing.',
    'Controlled outreach scheduled to begin Monday, July 20, 2026.'
  ],

  workload: {
    confirmedHours: 23.88,
    pendingEntries: 1,
    capacityStatus:
      'Full-time startup development is active. The current afternoon work session remains open and will be added after the final end time and breaks are confirmed.'
  },

  training: {
    loggedHours: 2.98,
    totalRequiredHours: 20
  },

  risks: [
    {
      risk: 'Customer and revenue validation are not yet established.',
      response:
        'Begin controlled outreach Monday, track conversion activity weekly, and require paid starter work before assuming recurring demand.'
    },
    {
      risk: 'The FY 2026–27 household-supporting target requires aggressive execution.',
      response:
        'Display conservative, required-base, and above-plan scenarios separately and compare actual results against each scenario monthly.'
    },
    {
      risk: 'The dashboard currently relies on manual data updates.',
      response:
        'Use twice-daily updates when practical and at minimum one daily update during active startup work.'
    },
    {
      risk: 'Professional legal, tax, insurance, and cybersecurity reviews remain incomplete.',
      response:
        'Complete the appropriate professional reviews before accepting complex contracts, handling sensitive client data, or expanding operational risk.'
    },
    {
      risk: 'SEAP forms, counselor meetings, and training verification carry firm deadlines.',
      response:
        'Track each requirement in the Project Control Center and retain submission and verification records.'
    }
  ],

  compliance: {
    deadlines: [
      {
        date: 'August 10, 2026',
        item: 'Individual Services Plan',
        status: 'Open'
      },
      {
        date: 'August 24, 2026',
        item: 'Individual Progress Report',
        status: 'Open'
      },
      {
        date: 'August 31, 2026',
        item: 'First ten training hours verification',
        status: 'Open'
      },
      {
        date: 'September 7, 2026',
        item: 'Business Strategy',
        status: 'Open — two counselor meetings required first'
      },
      {
        date: 'September 21, 2026',
        item: 'Final ten training hours verification',
        status: 'Open'
      }
    ]
  },

  professionalGates: [
    {
      name: 'Attorney review',
      status: 'Pending',
      action:
        'Review entity structure, agreements, intellectual property, releases, confidentiality, privacy, AI-use disclosures, and political-client safeguards.'
    },
    {
      name: 'CPA and tax review',
      status: 'Pending',
      action:
        'Review bookkeeping, tax treatment, estimated taxes, owner draw, deductions, sales-tax exposure, and fiscal-year reporting.'
    },
    {
      name: 'Insurance review',
      status: 'Pending',
      action:
        'Review general liability, professional liability, cyber, media, and equipment coverage.'
    },
    {
      name: 'Cybersecurity review',
      status: 'Pending',
      action:
        'Review credentials, backups, access controls, sensitive-data handling, incident response, and account recovery.'
    },
    {
      name: 'SCORE, VBOC, or SBDC review',
      status: 'Pending',
      action:
        'Challenge financial assumptions, service positioning, sales execution, operating controls, and launch readiness.'
    }
  ],

  actions: [
    'Finish testing the private shared dashboard.',
    'Confirm dashboard data and access boundaries with Kristine.',
    'Complete the first outreach packet before Monday.',
    'Prepare personalized outreach for the highest-priority warm prospects.',
    'Complete the discovery-call script and qualification questions.',
    'Confirm the first SEAP counselor meeting.',
    'Schedule the required training and verification path.',
    'Update the dashboard at the close of each work session.'
  ],

  decisions: [
    'OD Strategy is the executive operating and accountability platform.',
    'Next Steps Media & Digital Services remains the operating-company name.',
    'The business remains classified as a startup until launch benchmarks are achieved and maintained for one quarter.',
    'Kristine receives complete Partner and Accountability access.',
    'Advisor and Funding Review access will be limited to approved information relevant to each reviewer.',
    'The dashboard will show conservative, required-base, and above-plan financial scenarios separately.',
    'The production dashboard remains on the odstrategy-dashboard branch and will not be merged into the radio application main branch.',
    'Outreach begins Monday, July 20, after preparation and readiness review.'
  ],

  recordLinks: [
    {
      name: 'Project Control Center',
      url: 'https://docs.google.com/spreadsheets/d/19nKETpDwsD1kw267zcUH6_4bmSTMLsQY79mdfsmYZyU/edit'
    },
    {
      name: 'Daily Work Log',
      url: 'https://docs.google.com/spreadsheets/d/1GSJyMOu10lqLnfqEW87BElRRClYrFdRvsbZmRrsiDVQ/edit'
    },
    {
      name: 'CRM and Prospect Records',
      url: 'https://docs.google.com/spreadsheets/d/1lVwua0SBfcAJLGnt60n1kEEamKNp-XVMVmnpqdDGbhc/edit'
    },
    {
      name: 'GitHub Dashboard Branch',
      url: 'https://github.com/Peter-Vazquez/nextsteps-radio-app/tree/odstrategy-dashboard/odstrategy-dashboard'
    }
  ],

  approvedDocuments: []
};

function loadData() {
  if (!process.env.PRIVATE_DASHBOARD_DATA_JSON) {
    return safeDefault;
  }

  try {
    return JSON.parse(process.env.PRIVATE_DASHBOARD_DATA_JSON);
  } catch {
    return {
      ...safeDefault,
      meta: {
        ...safeDefault.meta,
        overallStatus: 'Secure data configuration error',
        statusExplanation:
          'PRIVATE_DASHBOARD_DATA_JSON could not be parsed. The safe default snapshot is being displayed.'
      }
    };
  }
}

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return json(res, 405, { message: 'Method not allowed.' });
  }

  if (!configured()) {
    return json(res, 503, { message: 'Secure dashboard is not configured.' });
  }

  if (!isAuthenticated(req)) {
    return json(res, 401, { message: 'Unauthorized.' });
  }

  return json(res, 200, loadData());
}