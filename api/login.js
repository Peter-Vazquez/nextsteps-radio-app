import { configured, createSessionToken, json, sessionCookie, verifyPassword } from './_auth.js';

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function clientKey(req) {
  return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown').split(',')[0].trim();
}

function allowed(key) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || now - current.started > WINDOW_MS) {
    attempts.set(key, { started: now, count: 0 });
    return true;
  }
  return current.count < MAX_ATTEMPTS;
}

function recordFailure(key) {
  const current = attempts.get(key) || { started: Date.now(), count: 0 };
  current.count += 1;
  attempts.set(key, current);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { message: 'Method not allowed.' });
  if (!configured()) return json(res, 503, { message: 'The secure owner portal is locked until DASHBOARD_PASSWORD and SESSION_SECRET are configured in Vercel.' });
  const key = clientKey(req);
  if (!allowed(key)) return json(res, 429, { message: 'Too many failed attempts. Try again later.' });
  const password = typeof req.body === 'string' ? JSON.parse(req.body || '{}').password : req.body?.password;
  if (!password || !verifyPassword(password)) {
    recordFailure(key);
    return json(res, 401, { message: 'Access denied.' });
  }
  attempts.delete(key);
  res.setHeader('Set-Cookie', sessionCookie(createSessionToken()));
  return json(res, 200, { authenticated: true });
}
