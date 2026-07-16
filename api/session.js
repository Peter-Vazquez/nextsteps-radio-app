import { configured, isAuthenticated, json } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { authenticated: false, message: 'The secure owner portal is locked until its Vercel environment variables are configured.' });
  return json(res, 200, { authenticated: isAuthenticated(req) });
}
