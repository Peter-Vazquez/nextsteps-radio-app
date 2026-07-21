import { configured, isAuthenticated, json } from './_auth.js';

const dailyPlan = {
  date: 'July 21, 2026',
  focus: 'Convert the first three personalized contacts into scheduled conversations while preparing the next controlled outreach wave.',
  tasks: [
    {
      what: 'Prepare for the Jose lunch discussion',
      when: 'Before Friday, July 24 at 2:00 PM',
      where: 'CRM, prospect notes, and meeting preparation',
      why: 'The meeting should reconnect personally, clarify needs, and determine the appropriate path to Bible Baptist Temple.',
      how: 'Review the relationship history, prepare a few focused questions, and define the desired next step without forcing a sales conversation.',
      status: 'Priority'
    },
    {
      what: 'Confirm the conversation with Pastor Ken',
      when: 'When Pastor Ken follows up',
      where: 'Facebook Messenger and calendar',
      why: 'A positive response should be converted promptly into a scheduled conversation.',
      how: 'Confirm the day, time, and format, then update the CRM and calendar immediately.',
      status: 'Next'
    },
    {
      what: 'Monitor Abe and continue controlled outreach',
      when: 'During the next protected outreach block',
      where: 'Professional email, CRM, and prospect list',
      why: 'Consistent outreach is required to build enough market evidence before changing the offer or message.',
      how: 'Monitor for Abe’s response, prepare the next three personalized contacts, and record every contact and next action.',
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
