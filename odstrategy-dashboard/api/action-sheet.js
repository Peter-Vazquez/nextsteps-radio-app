import { configured, isAuthenticated, json } from './_auth.js';
import {
  readActionRows,
  readArchiveRows,
  saveActionRow,
  archiveActionRow,
  clearActionRow,
  readValues,
  SPREADSHEETS
} from './_sheets.js';

const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');

function normalize(values = [], generatedPlan = null) {
  let taskStatus = {};
  try { taskStatus = JSON.parse(values[10] || '{}'); } catch { taskStatus = {}; }
  if (!taskStatus._plan && generatedPlan) taskStatus._plan = generatedPlan;
  return {
    recordId: values[0] || '',
    date: values[1] || '',
    status: values[2] || 'Open',
    objective: taskStatus._plan?.objective || values[3] || '',
    plannedStart: values[4] || '',
    plannedEnd: values[5] || '',
    actualStart: values[6] || '',
    actualEnd: values[7] || '',
    breakMinutes: Number(values[8] || 0),
    workHours: Number(values[9] || 0),
    taskStatus,
    contactsSent: Number(values[11] || 0),
    responses: Number(values[12] || 0),
    meetingsSet: Number(values[13] || 0),
    prospectingHours: Number(values[14] || 0),
    followUpNotes: values[15] || '',
    closeoutComments: values[16] || '',
    tomorrowFirstAction: values[17] || '',
    savedAt: values[18] || '',
    closedAt: values[19] || '',
    workLogSynced: String(values[20] || 'FALSE') === 'TRUE',
    scorecardSynced: String(values[21] || 'FALSE') === 'TRUE',
    crmReviewRequired: String(values[22] || 'TRUE') === 'TRUE',
    kanbanReviewRequired: String(values[23] || 'TRUE') === 'TRUE'
  };
}

function serialize(data, status) {
  const now = new Date().toISOString();
  return [
    data.recordId,
    data.date,
    status,
    data.objective,
    data.plannedStart,
    data.plannedEnd,
    data.actualStart,
    data.actualEnd,
    Number(data.breakMinutes || 0),
    Number(data.workHours || 0),
    JSON.stringify(data.taskStatus || {}),
    Number(data.contactsSent || 0),
    Number(data.responses || 0),
    Number(data.meetingsSet || 0),
    Number(data.prospectingHours || 0),
    data.followUpNotes || '',
    data.closeoutComments || '',
    data.tomorrowFirstAction || '',
    now,
    status === 'Closed' ? now : (data.closedAt || ''),
    data.workLogSynced ? 'TRUE' : 'FALSE',
    data.scorecardSynced ? 'TRUE' : 'FALSE',
    'TRUE',
    'TRUE'
  ];
}

function localDate() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'America/New_York',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

function addDays(value, days) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function nextOperatingDate(archiveRows = []) {
  const latestClosed = [...archiveRows].reverse().find(filled) || [];
  const latestDate = String(latestClosed[1] || '');
  const today = localDate();
  return latestDate && latestDate >= today ? addDays(latestDate, 1) : today;
}

function dateValue(value) {
  const parsed = Date.parse(String(value || ''));
  return Number.isNaN(parsed) ? Number.MAX_SAFE_INTEGER : parsed;
}

function taskScore(row = []) {
  const priority = String(row[5] || '').toLowerCase();
  const status = String(row[4] || '').toLowerCase();
  const due = dateValue(row[7]);
  const priorityWeight = priority.includes('critical') ? 0 : priority.includes('high') ? 1 : 2;
  const statusWeight = status.includes('in progress') || status.includes('this week') ? 0 : 1;
  return priorityWeight * 1e15 + statusWeight * 1e14 + due;
}

function chooseTask(tasks, pattern, excluded = new Set()) {
  return tasks
    .filter((row) => !excluded.has(row[0]))
    .filter((row) => pattern.test(`${row[1]} ${row[2]} ${row[3]}`))
    .sort((a, b) => taskScore(a) - taskScore(b))[0] || null;
}

function taskPlan(row, lane, fallbackTitle, fallbackCopy) {
  if (!row) return { lane, title: fallbackTitle, copy: fallbackCopy, taskId: '', completion: fallbackCopy };
  const completion = row[10] || row[12] || 'Complete the next documented milestone and retain evidence.';
  return {
    lane,
    taskId: row[0] || '',
    title: `${lane} lane — ${row[3]}`,
    copy: `Due ${row[7] || 'as soon as practical'}. Completion standard: ${completion}`,
    completion
  };
}

function dueFollowUps(pipelineRows, operatingDate) {
  const cutoff = Date.parse(`${operatingDate}T23:59:59`);
  return pipelineRows
    .filter(filled)
    .filter((row) => row[11] && dateValue(row[11]) <= cutoff)
    .filter((row) => !/won|lost|closed/i.test(row[6] || ''))
    .slice(0, 4)
    .map((row) => `${row[4] || row[3]}: ${row[12] || 'Complete the documented next action.'}`);
}

async function buildPlan(operatingDate) {
  const [kanbanRows, pipelineRows, readinessRows, trainingRows] = await Promise.all([
    readValues(SPREADSHEETS.control, "'Kanban Tasks'!A5:M100"),
    readValues(SPREADSHEETS.crm, "'Prospect Pipeline'!A5:R500"),
    readValues(SPREADSHEETS.control, "'Launch Readiness'!A5:J50"),
    readValues(SPREADSHEETS.training, "'Course Inventory'!A3:O100")
  ]);

  const openTasks = kanbanRows.filter(filled).filter((row) => !/completed|closed/i.test(row[4] || ''));
  const used = new Set();
  const revenueRow = chooseTask(openTasks, /outreach|prospect|crm|sales|discovery|proposal|client intake/i, used);
  if (revenueRow) used.add(revenueRow[0]);
  const buildRow = chooseTask(openTasks, /website|brand|material|presentation|production|portfolio|social|organic|sample/i, used);
  if (buildRow) used.add(buildRow[0]);
  const complianceRow = chooseTask(openTasks, /training|seap|counsel|formation|financial|professional|legal|insurance|readiness|go\/no-go/i, used);

  const revenue = taskPlan(
    revenueRow,
    'Revenue',
    'Complete the next protected prospecting and follow-up block',
    'Send or advance qualified contacts, convert responses into scheduled conversations, and update the CRM.'
  );
  const build = taskPlan(
    buildRow,
    'Build',
    'Complete one launch asset',
    'Finish one website, presentation, client-material, production, proof, or social-media deliverable.'
  );
  const compliance = taskPlan(
    complianceRow,
    'Compliance',
    'Complete one compliance milestone',
    'Advance training, counseling, SEAP forms, formation, financial controls, or professional review and retain evidence.'
  );

  const followUps = dueFollowUps(pipelineRows, operatingDate);
  const redGates = readinessRows.filter(filled).filter((row) => /red/i.test(row[5] || '')).slice(0, 3).map((row) => row[2]);
  const nextTraining = trainingRows.filter(filled).filter((row) => !/completed/i.test(row[12] || '')).sort((a, b) => Number(a[13] || 999) - Number(b[13] || 999))[0];

  return {
    generatedAt: new Date().toISOString(),
    date: operatingDate,
    objective: `Advance all three required lanes: ${revenue.title.replace('Revenue lane — ', '')}; ${build.title.replace('Build lane — ', '')}; and ${compliance.title.replace('Compliance lane — ', '')}.`,
    revenue,
    build,
    compliance,
    workspace: {
      title: 'Open the required operating workspace',
      copy: 'Review the newly generated sheet, CRM commitments, current deadlines, and only the records needed for today.'
    },
    record: {
      title: 'Record and synchronize every result',
      copy: 'Update the CRM, Daily Work Log, Project Control Center, Weekly Scorecard, Training Log when applicable, and the live dashboard.'
    },
    followUp: {
      title: followUps.length ? 'Complete due prospect follow-ups' : 'Check active responses at controlled intervals',
      copy: followUps.length ? followUps.join(' | ') : 'Monitor active channels without allowing inbox activity to replace the planned revenue, build, and compliance work.',
      respondTitle: 'Respond, schedule, and update the CRM',
      respondCopy: 'Convert every response into a dated next action, meeting, proposal step, or documented follow-up.',
      prepareTitle: 'Protect the next operating actions',
      prepareCopy: `Open readiness gates: ${redGates.join('; ') || 'No red gates identified.'}${nextTraining ? ` Next sequenced training: ${nextTraining[2]}.` : ''}`
    }
  };
}

async function freshRecord(archiveRows) {
  const date = nextOperatingDate(archiveRows);
  const plan = await buildPlan(date);
  return {
    recordId: `DAS-${date}`,
    date,
    status: 'Open',
    objective: plan.objective,
    plannedStart: '6:00 AM',
    plannedEnd: '8:00 PM',
    actualStart: '',
    actualEnd: '',
    breakMinutes: 0,
    workHours: 0,
    taskStatus: { _plan: plan },
    contactsSent: 0,
    responses: 0,
    meetingsSet: 0,
    prospectingHours: 0,
    followUpNotes: '',
    closeoutComments: '',
    tomorrowFirstAction: '',
    savedAt: '',
    closedAt: '',
    workLogSynced: false,
    scorecardSynced: false,
    crmReviewRequired: true,
    kanbanReviewRequired: true,
    isFresh: true
  };
}

export default async function handler(req, res) {
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    if (req.method === 'GET') {
      const rows = await readActionRows();
      const openRows = rows.filter((item) => String(item[2] || '').toLowerCase() === 'open');
      const row = [...openRows].reverse()[0];
      if (row) {
        const current = normalize(row);
        if (!current.taskStatus._plan) {
          const plan = await buildPlan(current.date || localDate());
          current.taskStatus._plan = plan;
          current.objective = plan.objective;
          await saveActionRow(serialize(current, 'Open'));
        }
        return json(res, 200, { record: current, source: 'active' });
      }
      const archiveRows = await readArchiveRows();
      const record = await freshRecord(archiveRows);
      await saveActionRow(serialize(record, 'Open'));
      return json(res, 200, { record, source: 'created' });
    }

    if (req.method === 'POST') {
      const data = req.body || {};
      if (!data.recordId || !data.date) return json(res, 400, { message: 'Record ID and date are required.' });
      const action = data.action === 'close' ? 'close' : 'save';
      const values = serialize(data, action === 'close' ? 'Closed' : 'Open');
      if (action === 'close') {
        await archiveActionRow(values);
        await clearActionRow(data.recordId);
        const archiveRows = await readArchiveRows();
        const record = await freshRecord([...archiveRows, values]);
        await saveActionRow(serialize(record, 'Open'));
        return json(res, 200, {
          message: 'Day closed, archived, and retired. A new action sheet was generated from the current roadmap with all tasks and daily totals reset.',
          record,
          retiredRecord: normalize(values)
        });
      }
      await saveActionRow(values);
      return json(res, 200, { message: 'Progress saved.', record: normalize(values) });
    }

    return json(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    return json(res, 500, { message: error.message || 'Action sheet could not be saved.' });
  }
}
