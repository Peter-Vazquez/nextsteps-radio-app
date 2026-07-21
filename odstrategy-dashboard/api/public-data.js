import { readActionRows, readValues, SPREADSHEETS } from './_sheets.js';

const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const last = (rows) => [...rows].reverse().find(filled) || [];
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || last(rows);

function trainingMap(rows) {
  return Object.fromEntries(rows.filter((row) => row[0]).map((row) => [String(row[0]), row[1]]));
}

function publicGate(rows, category, label) {
  const row = rows.find((item) => String(item[1] || '').toLowerCase() === category.toLowerCase());
  return {
    name: label,
    status: row?.[5] || 'Not started',
    due: row?.[3] || 'Date pending',
    standard: row?.[2] || 'Completion standard is being finalized.'
  };
}

function phase(readinessScore, contacts) {
  if (readinessScore >= 100) return 'Launch ready';
  if (contacts > 0) return 'Controlled pre-launch execution and market validation';
  return 'Pre-launch preparation and readiness';
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    res.setHeader('X-Content-Type-Options', 'nosniff');

    const [
      actionRows,
      readinessRows,
      kanbanRows,
      pipelineRows,
      outreachRows,
      scorecardRows,
      trainingRows
    ] = await Promise.all([
      readActionRows(),
      readValues(SPREADSHEETS.control, "'Launch Readiness'!A5:J60"),
      readValues(SPREADSHEETS.control, "'Kanban Tasks'!A5:M120"),
      readValues(SPREADSHEETS.crm, "'Prospect Pipeline'!A5:R500"),
      readValues(SPREADSHEETS.crm, "'Outreach Log'!A5:M500"),
      readValues(SPREADSHEETS.control, "'Weekly Scorecard'!A5:Q40"),
      readValues(SPREADSHEETS.training, "'Dashboard'!A4:G12")
    ]);

    const active = latestOpen(actionRows);
    const readiness = readinessRows.filter(filled);
    const green = readiness.filter((row) => /green/i.test(row[5] || '')).length;
    const readinessScore = readiness.length ? Math.round((green / readiness.length) * 100) : 0;
    const prospects = pipelineRows.filter(filled);
    const contacted = prospects.filter((row) => row[9]).length;
    const scheduled = prospects.filter((row) => /discovery scheduled/i.test(row[6] || '')).length;
    const pipelineValue = prospects.reduce((sum, row) => sum + num(row[13]), 0);
    const openCriticalTasks = kanbanRows.filter(filled).filter((row) => /critical/i.test(row[5] || '') && !/completed|closed/i.test(row[4] || '')).length;
    const training = trainingMap(trainingRows);
    const eligibleHours = num(training['Completed Eligible Hours']);
    const pendingHours = num(training['Pending Verification Hours']);
    const weekly = last(scorecardRows.filter(filled));

    const contactsToday = num(active[11]);
    const responsesToday = num(active[12]);
    const meetingsToday = num(active[13]);

    const publicData = {
      meta: {
        promise: 'Helping meaningful voices be seen, heard, trusted, and found.',
        phase: phase(readinessScore, contacted),
        outreachStart: contacted > 0 ? 'Active — first controlled outreach completed' : 'Controlled outreach pending',
        updated: active[18] || new Date().toISOString(),
        fiscalCycle: 'August 1–July 31',
        launchDate: 'August 1, 2026',
        privacy: 'Approved public summaries only'
      },
      metrics: {
        prospects: prospects.length,
        pipeline: pipelineValue,
        contacts: contacted,
        responses: responsesToday,
        meetings: scheduled || meetingsToday,
        weeklyContacts: num(weekly[2]),
        trainingEligible: eligibleHours,
        trainingPending: pendingHours,
        trainingRequired: 20,
        readinessScore,
        openCriticalTasks,
        outreachRecords: outreachRows.filter(filled).length,
        contactsToday,
        responsesToday,
        meetingsToday
      },
      workstreams: [
        {
          name: 'Revenue and market validation',
          status: contacted > 0 ? 'In progress' : 'Not started',
          due: 'Weekly operating standard',
          standard: '10–15 personalized contacts, two or more conversations scheduled, and at least one proposal-ready opportunity.'
        },
        publicGate(readiness, 'Website', 'Website and lead capture'),
        publicGate(readiness, 'Materials', 'Client materials and presentation'),
        publicGate(readiness, 'Training', 'Training and evidence'),
        publicGate(readiness, 'SEAP', 'SEAP compliance and counseling'),
        publicGate(readiness, 'Formation', 'New York business formation'),
        publicGate(readiness, 'Organic marketing', 'Organic social-media launch')
      ],
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
      annualPlans: [
        ['FY 2026–27', 118400, 57050, 19844, 'Required operating target'],
        ['FY 2027–28', 174000, 84300, 42788, 'Household-supporting base case'],
        ['FY 2028–29', 228000, 99000, 70796, 'Pricing and service expansion'],
        ['FY 2029–30', 262800, 117000, 91023, 'Mature premium practice'],
        ['FY 2030–31', 325800, 138000, 115571, 'Selective scale']
      ],
      growth: [
        ['1. Prove demand', 'Complete qualified outreach, discovery calls, proposals, paid starter projects, and customer interviews.'],
        ['2. Prove delivery', 'Deliver the same standardized scope more than once, within planned hours and quality controls.'],
        ['3. Prove recurring value', 'Convert successful starter projects into prepaid monthly retainers and referrals.'],
        ['4. Expand selectively', 'Add pricing, capacity, contractors, tools, or secondary services only after cash, quality, and demand justify them.']
      ],
      milestones: [
        ['July 21, 2026', 'First controlled outreach wave', `${contactsToday || contacted} personalized contacts, ${responsesToday} responses, and ${meetingsToday || scheduled} meeting scheduled.`],
        ['July 31, 2026', 'Formation and launch-control checkpoint', 'New York formation pathway, professional-review route, counselor meeting, materials, and financial controls documented.'],
        ['August 1, 2026', 'Controlled soft launch', 'Offers, CRM, payment method, client controls, production workflow, and minimum viable lead path ready.'],
        ['August 10, 2026', 'Individual Services Plan due', 'Completed form submitted and confirmation retained.'],
        ['August 31, 2026', 'First training verification due', 'First ten eligible hours completed, verified, submitted, and retained.'],
        ['September 7, 2026', 'Business Strategy due', 'Strategy submitted after two counselor meetings.'],
        ['September 21, 2026', 'Final training verification due', 'All twenty eligible hours completed, verified, submitted, and retained.']
      ]
    };

    return res.status(200).json(publicData);
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Public dashboard data could not be loaded.' });
  }
}
