const { clearSessionCookie } = require('../../lib/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};
