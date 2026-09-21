const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');

function toJson(r) {
  return { id: String(r.id), cod: r.cod, nome: r.nome, cat: r.cat, un: r.un, preco: Number(r.preco), estoque: Number(r.estoque) };
}

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();
    const { id } = req.query;

    if (req.method === 'PUT') {
      const b = req.body || {};
      const rows = await sql`
        UPDATE produtos SET
          cod = ${b.cod || ''}, nome = ${b.nome}, cat = ${b.cat || ''}, un = ${b.un || ''},
          preco = ${Number(b.preco) || 0}, estoque = ${Number(b.estoque) || 0}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'produto nao encontrado' });
      return res.status(200).json(toJson(rows[0]));
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM produtos WHERE id = ${id}`;
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'PUT, DELETE');
    return res.status(405).end();
  } catch (err) {
    if (err.code === 'DB_NOT_CONFIGURED') {
      return res.status(503).json({ error: 'Banco de dados ainda não configurado.' });
    }
    console.error(err);
    return res.status(500).json({ error: 'Erro interno, tente novamente.' });
  }
};
