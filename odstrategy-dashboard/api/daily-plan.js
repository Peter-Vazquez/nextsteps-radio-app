import { configured, isAuthenticated, json } from './_auth.js';
import { readActionRows } from './_sheets.js';

const filled = (row) => row && row.some((value) => String(value ?? '').trim() !== '');
const latestOpen = (rows) => [...rows].reverse().find((row) => String(row[2] || '').toLowerCase() === 'open') || [...rows].reverse().find(filled) || [];

function readableDate(value) {
  if (!value) return 'Current operating day';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function buildPlan(row) {
  const date = row[1] || '';
  const objective = row[3] || 'Complete the highest-priority operating work and document every result.';
  const followUp = row[15] || 'Review current responses, commitments, and open next actions.';
  const tomorrow = row[17] || 'Complete the next controlled action in the launch plan.';
  const status = String(row[2] || 'Open');
  return {
    date: readableDate(date),
    focus: objective,
    source: 'Live Daily Action Sheet',
    status,
    tasks: [
      {
        what: 'Complete the current primary objective',
        when: row[4] && row[5] ? `${row[4]}–${row[5]}` : 'During the protected operating block',
        where: 'Daily Action Sheet and linked operating systems',
        why: 'The active action record is the controlling plan for the workday.',
        how: objective,
        status: 'Priority'
      },
      {
        what: 'Manage responses and confirmed next actions',
        when: 'At controlled intervals during the workday',
        where: 'CRM, email, messages, calendar, and prospect notes',
        why: 'Prompt follow-up converts interest into scheduled conversations and documented commitments.',
        how: followUp,
        status: 'Active'
      },
      {
        what: 'Protect the next operating step',
        when: 'Before pausing or closing the workday',
        where: 'Project Control Center, CRM, logs, and dashboard',
        why: 'Every active day must end with a clear next action and synchronized records.',
        how: tomorrow,
        status: status === 'Closed' ? 'Completed' : 'Queued'
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
    return json(res, 200, buildPlan(latestOpen(rows)));
  } catch (error) {
    return json(res, 500, { message: error.message || 'Daily plan could not be loaded.' });
  }
}
