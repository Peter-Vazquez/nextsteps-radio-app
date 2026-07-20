import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, saveActionRow, archiveActionRow } from './_sheets.js';

function normalize(values = []) {
  return {
    recordId: values[0] || '', date: values[1] || '', status: values[2] || 'Open', objective: values[3] || '',
    plannedStart: values[4] || '', plannedEnd: values[5] || '', actualStart: values[6] || '', actualEnd: values[7] || '',
    breakMinutes: Number(values[8] || 0), workHours: Number(values[9] || 0), taskStatus: JSON.parse(values[10] || '{}'),
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

export default async function handler(req, res) {
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    if (req.method === 'GET') {
      const rows = await readActionRows();
      const date = String(req.query?.date || '');
      const row = [...rows].reverse().find((item) => !date || String(item[1] || '') === date) || [];
      return json(res, 200, { record: normalize(row) });
    }
    if (req.method === 'POST') {
      const data = req.body || {};
      if (!data.recordId || !data.date) return json(res, 400, { message: 'Record ID and date are required.' });
      const action = data.action === 'close' ? 'close' : 'save';
      const values = serialize(data, action === 'close' ? 'Closed' : 'Open');
      await saveActionRow(values);
      if (action === 'close') await archiveActionRow(values);
      return json(res, 200, { message: action === 'close' ? 'Day closed and archived.' : 'Progress saved.', record: normalize(values) });
    }
    return json(res, 405, { message: 'Method not allowed.' });
  } catch (error) {
    return json(res, 500, { message: error.message || 'Action sheet could not be saved.' });
  }
}
