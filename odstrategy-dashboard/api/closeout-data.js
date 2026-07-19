import { configured, isAuthenticated, json } from './_auth.js';

const closeout = {
  asOf: 'July 19, 2026 — 12:46 AM closeout',
  confirmedHours: 34.08,
  pendingEntries: 0,
  capacityStatus: 'All reported startup work is reconciled through 12:46 AM July 19. The July 18–19 closeout added 4.00 active hours: 3.23 hours on July 18 and 0.77 hour on July 19.',
  overallStatus: 'Pre-launch — platform ready; customer proof required',
  statusExplanation: 'Dashboard modernization and the July 18–19 closeout are complete. Controlled outreach, qualified conversations, paid work, and collected revenue are now the decisive proof.'
};

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  return json(res, 200, closeout);
}
