import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows } from './_sheets.js';

const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || [...rows].reverse().find(filled) || [];

function readableDate(value) {
  if (!value) return 'Current operating day';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function buildSummary(row) {
  const date = row[1] || '';
  const objective = row[3] || 'Complete the highest-priority operating work and document every verified result.';
  const followUp = row[15] || 'No material response or follow-up note has been recorded yet.';
  const nextAction = row[17] || 'Complete the next controlled action in the launch plan.';
  const status = String(row[2] || 'Open');
  return {
    date: readableDate(date),
    focus: objective,
    source: 'Live Daily Operating Summary',
    status,
    tasks: [
      {
        what: 'Operating focus',
        when: 'Current operating day',
        where: 'Governing source records and Project Control Center',
        why: 'The stakeholder view should state the controlling objective without duplicating task systems.',
        how: objective,
        status: status === 'Closed' ? 'Completed' : 'Current'
      },
      {
        what: 'Responses, commitments, and material follow-up',
        when: 'As verified activity is recorded',
        where: 'CRM, calendar, source records, and Daily Operating Summary',
        why: 'Material changes should be visible to authorized reviewers without creating a competing source of truth.',
        how: followUp,
        status: 'Current'
      },
      {
        what: 'Most important next action',
        when: 'Before the next operating transition',
        where: 'Project Control Center, CRM, calendar, and applicable compliance records',
        why: 'Every active day should preserve one clear forward action and synchronized evidence.',
        how: nextAction,
        status: status === 'Closed' ? 'Completed' : 'Next'
      }
    ]
  };
}

export default async function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  try {
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    const rows = await readActionRows();
    return json(res, 200, buildSummary(latestOpen(rows)));
  } catch (error) {
    return json(res, 500, { message: error.message || 'Daily operating summary could not be loaded.' });
  }
}