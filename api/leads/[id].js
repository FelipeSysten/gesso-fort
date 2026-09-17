const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();
    const { id } = req.query;

    if (req.method === 'PATCH') {
      const sit = (req.body || {}).sit;
      if (!sit) return res.status(400).json({ error: 'sit obrigatorio' });
      await sql`UPDATE leads SET sit = ${sit} WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'PATCH');
    return res.status(405).end();
  } catch (err) {
    if (err.code === 'DB_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Banco de dados ainda não configurado.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno, tente novamente.' });
  }
};
