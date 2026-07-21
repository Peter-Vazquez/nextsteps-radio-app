import { configured, isAuthenticated, json } from './_auth.js';

const closeout = {
  asOf: 'July 21, 2026 — 9:33 AM progress update',
  confirmedHours: 39.13,
  pendingEntries: 1,
  capacityStatus: 'All reported startup work is reconciled through the July 20 closeout. July 20 added 3.33 active hours from 7:30 AM to 11:15 AM with a 25-minute break. The July 21 workday began at 7:30 AM and remains open with no break reported and no final hours entered yet.',
  overallStatus: 'Pre-launch — first outreach completed; two positive responses and one meeting scheduled',
  statusExplanation: 'Three personalized contacts were sent July 21. Pastor Ken Todd responded positively and expects to arrange a conversation. Pastor Jose Rodriguez scheduled lunch and discussion for Friday, July 24 at 2:00 PM. Abraham Hernandez remains awaiting response. The immediate priorities are meeting preparation, response follow-up, and the next controlled outreach block.'
};

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  return json(res, 200, closeout);
}
