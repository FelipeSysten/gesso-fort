const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');

function toJson(r) {
  return { id: String(r.id), cod: r.cod, nome: r.nome, cat: r.cat, un: r.un, preco: Number(r.preco), prazo: r.prazo };
}

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM servicos ORDER BY created_at DESC`;
      return res.status(200).json(rows.map(toJson));
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.nome) return res.status(400).json({ error: 'nome obrigatorio' });
      const rows = await sql`
        INSERT INTO servicos (cod, nome, cat, un, preco, prazo)
        VALUES (${b.cod || ''}, ${b.nome}, ${b.cat || ''}, ${b.un || ''}, ${Number(b.preco) || 0}, ${b.prazo || ''})
        RETURNING *
      `;
      return res.status(201).json(toJson(rows[0]));
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
