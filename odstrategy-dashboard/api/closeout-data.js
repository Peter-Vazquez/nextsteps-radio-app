import { configured, isAuthenticated, json } from './_auth.js';

const closeout = {
  asOf: 'July 19, 2026 — 4:28 PM closeout',
  confirmedHours: 35.80,
  pendingEntries: 0,
  capacityStatus: 'All reported startup work is reconciled through 4:28 PM July 19. The afternoon prospect-qualification session added 1.72 active hours from 2:45 PM to 4:28 PM. No training hours or completed outreach contacts were claimed.',
  overallStatus: 'Pre-launch — outreach preparation advanced; customer proof required',
  statusExplanation: 'Bible Baptist Temple and Faith on Film TV relationship paths, needs, decision-makers, contact channels, and recommended outreach sequences are documented. No outreach has been sent. The next work session should complete the remaining first-wave preparation and begin controlled market contact.'
};

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  return json(res, 200, closeout);
}
