import crypto from 'node:crypto';

export const SPREADSHEETS = {
  control: '19nKETpDwsD1kw267zcUH6_4bmSTMLsQY79mdfsmYZyU',
  crm: '1lVwua0SBfcAJLGnt60n1kEEamKNp-XVMVmnpqdDGbhc',
  workLog: '1GSJyMOu10lqLnfqEW87BElRRClYrFdRvsbZmRrsiDVQ',
  training: '1hfMefQV_gISQ6gqZAR5ZG_iXzveGzCumRyfwJplFwM4'
};

const CURRENT_RANGE = "'Daily Action Sheet'!A5:X200";
const ARCHIVE_RANGE = "'Daily Action Archive'!A:X";

function b64url(value) {
  return Buffer.from(value).toString('base64url');
}

function credentials() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_JSON is not configured.');
  const parsed = JSON.parse(raw);
  if (!parsed.client_email || !parsed.private_key) throw new Error('Google service-account credentials are incomplete.');
  return parsed;
}

async function accessToken() {
  const service = credentials();
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = b64url(JSON.stringify({
    iss: service.client_email,
    scope: 'https://www.googleapis.com/auth/spreadsheets',
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600
  }));
  const unsigned = `${header}.${claim}`;
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(unsigned);
  signer.end();
  const signature = signer.sign(service.private_key, 'base64url');
  const assertion = `${unsigned}.${signature}`;
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion })
  });
  const body = await response.json();
  if (!response.ok || !body.access_token) throw new Error(body.error_description || 'Google authentication failed.');
  return body.access_token;
}

async function googleFetch(spreadsheetId, path, options = {}) {
  const token = await accessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error?.message || 'Google Sheets request failed.');
  return body;
}

export async function readValues(spreadsheetId, range) {
  const encoded = encodeURIComponent(range);
  const result = await googleFetch(spreadsheetId, `/values/${encoded}?majorDimension=ROWS&valueRenderOption=FORMATTED_VALUE`);
  return result.values || [];
}

export async function readActionRows() {
  return readValues(SPREADSHEETS.control, CURRENT_RANGE);
}

export async function saveActionRow(values) {
  const rows = await readActionRows();
  const recordId = String(values[0]);
  const index = rows.findIndex((row) => String(row[0] || '') === recordId);
  const rowNumber = index >= 0 ? index + 5 : rows.length + 5;
  const targetRange = `'Daily Action Sheet'!A${rowNumber}:X${rowNumber}`;
  const target = encodeURIComponent(targetRange);
  return googleFetch(SPREADSHEETS.control, `/values/${target}?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    body: JSON.stringify({ range: targetRange, majorDimension: 'ROWS', values: [values] })
  });
}

export async function archiveActionRow(values) {
  const encoded = encodeURIComponent(ARCHIVE_RANGE);
  return googleFetch(SPREADSHEETS.control, `/values/${encoded}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`, {
    method: 'POST',
    body: JSON.stringify({ range: ARCHIVE_RANGE, majorDimension: 'ROWS', values: [values] })
  });
}
