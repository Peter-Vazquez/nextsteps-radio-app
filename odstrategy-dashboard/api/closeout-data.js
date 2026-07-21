import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows, readValues, SPREADSHEETS } from './_sheets.js';

const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || [...rows].reverse().find(filled) || [];

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const [actions, workRows] = await Promise.all([
      readActionRows(),
      readValues(SPREADSHEETS.workLog, "'Daily Work Log'!A5:M1000")
    ]);
    const active = latestOpen(actions);
    const confirmedHours = workRows.filter(filled).reduce((sum, row) => sum + num(row[5]), 0);
    const open = String(active[2] || '').toLowerCase() === 'open';
    const contacts = num(active[11]);
    const responses = num(active[12]);
    const meetings = num(active[13]);
    return json(res, 200, {
      asOf: active[18] || new Date().toISOString(),
      confirmedHours: Number(confirmedHours.toFixed(2)),
      pendingEntries: open ? 1 : 0,
      capacityStatus: open
        ? `The ${active[1] || 'current'} workday remains open. Start: ${active[6] || 'not recorded'}; breaks: ${num(active[8])}; final hours are pending closeout.`
        : (active[16] || 'The latest operating record is closed and reconciled.'),
      overallStatus: `Pre-launch — ${contacts} contacts, ${responses} responses, ${meetings} meeting scheduled`,
      statusExplanation: active[15] || active[3] || 'Live operating records are connected and current.'
    });
  } catch (error) {
    return json(res, 500, { message: error.message || 'Closeout data could not be loaded.' });
  }
}
