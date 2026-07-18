import { configured, isAuthenticated, json } from './_auth.js';

const dailyPlan = {
  date: 'July 18, 2026',
  focus: 'Modernize the OD Strategy dashboard into a clear daily operating guide.',
  tasks: [
    {
      what: 'Complete dashboard modernization',
      when: '8:00 AM–10:00 AM',
      where: 'OD Strategy preview branch and Dreamweaver',
      why: 'Make the dashboard useful as a fast daily guide, not only a reporting page.',
      how: 'Simplify the layout, add KPI visuals and charts, and preserve all existing security and functionality.',
      status: 'In progress'
    },
    {
      what: 'Verify the modernized preview',
      when: 'Immediately after build',
      where: 'Local browser and Vercel preview',
      why: 'Confirm the design works before changing production.',
      how: 'Test desktop, mobile, login, logout, charts, links, and protected information boundaries.',
      status: 'Next'
    },
    {
      what: 'Resume Prospect 2 preparation',
      when: 'After dashboard approval',
      where: 'CRM and outreach workflow',
      why: 'Keep controlled outreach preparation moving toward the July 20 start.',
      how: 'Define the Craig Jones relationship, church need, contact method, and first conversation objective.',
      status: 'Queued'
    }
  ]
};

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'Secure dashboard is not configured.' });
  if (!isAuthenticated(req)) return json(res, 401, { message: 'Unauthorized.' });
  return json(res, 200, dailyPlan);
}
