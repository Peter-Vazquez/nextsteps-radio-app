import crypto from 'node:crypto';

const COOKIE_NAME = 'od_shared_session';
const SESSION_SECONDS = 60 * 60 * 8;

export function configured() {
  return Boolean(process.env.DASHBOARD_PASSWORD && process.env.SESSION_SECRET && process.env.SESSION_SECRET.length >= 32);
}

function safeEqual(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

function sign(value) {
  return crypto.createHmac('sha256', process.env.SESSION_SECRET).update(value).digest('base64url');
}

export function verifyPassword(candidate) {
  return configured() && safeEqual(candidate, process.env.DASHBOARD_PASSWORD);
}

export function createSessionToken() {
  const issued = Math.floor(Date.now() / 1000);
  const expires = issued + SESSION_SECONDS;
  const nonce = crypto.randomBytes(18).toString('base64url');
  const payload = `${issued}.${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
}

function readCookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=');
    return index < 0 ? [part, ''] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
  }));
}

export function isAuthenticated(req) {
  const token = readCookies(req)[COOKIE_NAME];
  if (!configured() || !token) return false;
  const parts = String(token).split('.');
  if (parts.length !== 4) return false;
  const [issued, expires, nonce, signature] = parts;
  const payload = `${issued}.${expires}.${nonce}`;
  const now = Math.floor(Date.now() / 1000);
  return safeEqual(signature, sign(payload)) && Number(issued) <= now + 60 && Number(expires) > now;
}

export function sessionCookie(token) {
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`;
}

export function clearSessionCookie() {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;
}

export function json(res, status, body) {
  res.setHeader('Cache-Control', 'no-store, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('X-Frame-Options', 'DENY');
  res.status(status).json(body);
}
