import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows } from './_sheets.js';

const num = (value) => Number(String(value ?? '').replace(/[$,%]/g, '').replace(/,/g, '')) || 0;
const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || [...rows].reverse().find(filled) || [];

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const actions = await readActionRows();
    const active = latestOpen(actions);
    const open = String(active[2] || '').toLowerCase() === 'open';
    const contacts = num(active[11]);
    const responses = num(active[12]);
    const meetings = num(active[13]);
    return json(res, 200, {
      asOf: active[18] || new Date().toISOString(),
      recordStatus: open ? 'Open operating record' : 'Latest operating record closed and reconciled',
      capacityStatus: 'Owner business hours are not tracked. Capacity is evaluated through client load, deliverable quality, pipeline movement, deadlines, compliance, cash, and risk.',
      overallStatus: `Controlled soft launch - ${contacts} contacts, ${responses} responses, ${meetings} meetings set in the current operating record`,
      statusExplanation: active[15] || active[16] || active[3] || 'Live operating records are connected and current.'
    });
  } catch (error) {
    return json(res, 500, { message: error.message || 'Closeout data could not be loaded.' });
  }
}