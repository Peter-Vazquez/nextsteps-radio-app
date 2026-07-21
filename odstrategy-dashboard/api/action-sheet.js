import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, readArchiveRows, saveActionRow, archiveActionRow, clearActionRow } from './_sheets.js';

function normalize(values = []) {
  let taskStatus = {};
  try { taskStatus = JSON.parse(values[10] || '{}'); } catch { taskStatus = {}; }
  return {
    recordId: values[0] || '', date: values[1] || '', status: values[2] || 'Open', objective: values[3] || '',
    plannedStart: values[4] || '', plannedEnd: values[5] || '', actualStart: values[6] || '', actualEnd: values[7] || '',
    breakMinutes: Number(values[8] || 0), workHours: Number(values[9] || 0), taskStatus,
    contactsSent: Number(values[11] || 0), responses: Number(values[12] || 0), meetingsSet: Number(values[13] || 0),
    prospectingHours: Number(values[14] || 0), followUpNotes: values[15] || '', closeoutComments: values[16] || '',
    tomorrowFirstAction: values[17] || '', savedAt: values[18] || '', closedAt: values[19] || '',
    workLogSynced: String(values[20] || 'FALSE') === 'TRUE', scorecardSynced: String(values[21] || 'FALSE') === 'TRUE',
    crmReviewRequired: String(values[22] || 'TRUE') === 'TRUE', kanbanReviewRequired: String(values[23] || 'TRUE') === 'TRUE'
  };
}

function serialize(data, status) {
  const now = new Date().toISOString();
  return [
    data.recordId, data.date, status, data.objective, data.plannedStart, data.plannedEnd, data.actualStart, data.actualEnd,
    Number(data.breakMinutes || 0), Number(data.workHours || 0), JSON.stringify(data.taskStatus || {}), Number(data.contactsSent || 0),
    Number(data.responses || 0), Number(data.meetingsSet || 0), Number(data.prospectingHours || 0), data.followUpNotes || '',
    data.closeoutComments || '', data.tomorrowFirstAction || '', now, status === 'Closed' ? now : (data.closedAt || ''),
    data.workLogSynced ? 'TRUE' : 'FALSE', data.scorecardSynced ? 'TRUE' : 'FALSE', 'TRUE', 'TRUE'
  ];
}

function localDate() {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}

function freshRecord(archiveRows) {
  const latestClosed = [...archiveRows].reverse().find((row) => row && row.some((value) => String(value || '').trim())) || [];
  const date = localDate();
  const objective = latestClosed[17] || 'Complete the highest-priority operating work for today and document every result.';
  return {
    recordId: `DAS-${date}`,
    date,
    status: 'Draft',
    objective,
    plannedStart: '6:00 AM',
    plannedEnd: '8:00 PM',
    actualStart: '', actualEnd: '', breakMinutes: 0, workHours: 0,
    taskStatus: {}, contactsSent: 0, responses: 0, meetingsSet: 0, prospectingHours: 0,
    followUpNotes: '', closeoutComments: '', tomorrowFirstAction: '', savedAt: '', closedAt: '',
    workLogSynced: false, scorecardSynced: false, crmReviewRequired: true, kanbanReviewRequired: true,
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
      const date = String(req.query?.date || '');
      const openRows = rows.filter((item) => String(item[2] || '').toLowerCase() === 'open');
      const row = date
        ? [...openRows].reverse().find((item) => String(item[1] || '') === date)
        : [...openRows].reverse()[0];
      if (row) return json(res, 200, { record: normalize(row), source: 'active' });
      const archiveRows = await readArchiveRows();
      return json(res, 200, { record: freshRecord(archiveRows), source: 'fresh' });
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
        return json(res, 200, {
          message: 'Day closed, archived, and retired. A new daily action sheet has been created.',
          record: freshRecord([...archiveRows, values]),
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
