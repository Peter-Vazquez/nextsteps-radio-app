import { configured, isAuthenticated, json } from './_auth.js';

const dailyPlan = {
  date: 'July 20, 2026',
  focus: 'Begin controlled outreach and convert preparation into qualified conversations.',
  tasks: [
    {
      what: 'Complete the first-wave outreach packet',
      when: 'Before the first contact block',
      where: 'CRM and outreach workflow',
      why: 'Start outreach with consistent, personalized messages and clear objectives.',
      how: 'Finish the remaining personalized openings, verify contact routes, and confirm each prospect’s first-conversation objective.',
      status: 'Priority'
    },
    {
      what: 'Send and record the first personalized contacts',
      when: 'During the protected outreach block',
      where: 'Approved contact channels and CRM',
      why: 'Market conversations, not additional dashboard refinement, are now the primary proof of progress.',
      how: 'Contact the highest-priority warm prospects and immediately record the message, response, next action, and follow-up date.',
      status: 'Next'
    },
    {
      what: 'Prepare follow-up and discovery readiness',
      when: 'After the first contact block',
      where: 'CRM, discovery guide, and calendar',
      why: 'Fast, organized follow-up improves response conversion and protects momentum.',
      how: 'Finalize the discovery questions, prepare response paths, and schedule every agreed next step.',
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
