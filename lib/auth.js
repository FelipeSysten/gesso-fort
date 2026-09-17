const crypto = require('crypto');

const COOKIE_NAME = 'gf_session';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 dias

function secret() {
  return process.env.SESSION_SECRET || 'gesso-fort-dev-secret-troque-em-producao';
}

function sign(value) {
  const h = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  return value + '.' + h;
}

function verify(signed) {
  if (!signed) return null;
  const idx = signed.lastIndexOf('.');
  if (idx < 0) return null;
  const value = signed.slice(0, idx);
  const sig = signed.slice(idx + 1);
  const expected = crypto.createHmac('sha256', secret()).update(value).digest('hex');
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  return value;
}

function parseCookies(req) {
  const header = (req.headers && req.headers.cookie) || '';
  const out = {};
  header.split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > -1) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function isAuthed(req) {
  const cookies = parseCookies(req);
  return verify(cookies[COOKIE_NAME]) === 'ok';
}

function setSessionCookie(res) {
  const token = sign('ok');
  const secure = process.env.VERCEL_ENV ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    COOKIE_NAME + '=' + encodeURIComponent(token) + '; Path=/; HttpOnly; SameSite=Lax; Max-Age=' + MAX_AGE + secure
  );
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', COOKIE_NAME + '=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
}

module.exports = { isAuthed, setSessionCookie, clearSessionCookie };
