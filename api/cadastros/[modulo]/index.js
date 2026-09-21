const { getSql } = require('../../../lib/db');
const { isAuthed } = require('../../../lib/auth');
const { getEntry, qi, dbCol, coerce, toJson } = require('../../../lib/cadastros');

module.exports = async (req, res) => {
  const entry = getEntry(req.query.modulo);
  if (!entry) return res.status(404).json({ error: 'cadastro desconhecido' });

  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql('SELECT * FROM ' + qi(entry.table) + ' ORDER BY created_at DESC');
      return res.status(200).json(rows.map((r) => toJson(entry, r)));
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      const dbColumns = entry.cols.map((k) => qi(dbCol(entry, k)));
      const values = entry.cols.map((k) => coerce(entry, k, b[k]));
      const placeholders = values.map((_, i) => '$' + (i + 1));
      const text = 'INSERT INTO ' + qi(entry.table) + ' (' + dbColumns.join(', ') + ') VALUES (' + placeholders.join(', ') + ') RETURNING *';
      const rows = await sql(text, values);
      return res.status(201).json(toJson(entry, rows[0]));
    }

    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  } catch (err) {
    if (err.code === 'DB_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Banco de dados ainda não configurado.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno, tente novamente.' });
  }
};
