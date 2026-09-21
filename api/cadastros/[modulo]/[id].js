const { getSql } = require('../../../lib/db');
const { isAuthed } = require('../../../lib/auth');
const { getEntry, qi, dbCol, coerce, toJson } = require('../../../lib/cadastros');

module.exports = async (req, res) => {
  const entry = getEntry(req.query.modulo);
  if (!entry) return res.status(404).json({ error: 'cadastro desconhecido' });
  const { id } = req.query;

  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const b = req.body || {};
      const keys = entry.cols.filter((k) => Object.prototype.hasOwnProperty.call(b, k));
      if (!keys.length) return res.status(400).json({ error: 'nada para atualizar' });
      const values = keys.map((k) => coerce(entry, k, b[k]));
      const setSql = keys.map((k, i) => qi(dbCol(entry, k)) + ' = $' + (i + 1)).join(', ');
      const text = 'UPDATE ' + qi(entry.table) + ' SET ' + setSql + ' WHERE id = $' + (values.length + 1) + ' RETURNING *';
      const rows = await sql(text, [...values, id]);
      if (!rows.length) return res.status(404).json({ error: 'registro nao encontrado' });
      return res.status(200).json(toJson(entry, rows[0]));
    }

    if (req.method === 'DELETE') {
      await sql('DELETE FROM ' + qi(entry.table) + ' WHERE id = $1', [id]);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'PUT, PATCH, DELETE');
    return res.status(405).end();
  } catch (err) {
    if (err.code === 'DB_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Banco de dados ainda não configurado.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno, tente novamente.' });
  }
};
