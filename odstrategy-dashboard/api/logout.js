import { clearSessionCookie, json } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { message: 'Method not allowed.' });
  res.setHeader('Set-Cookie', clearSessionCookie());
  return json(res, 200, { authenticated: false });
}
