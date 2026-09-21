const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');

// Rota unica para /api/servicos e /api/servicos/:id (limite de 12 Serverless
// Functions do plano Hobby da Vercel nao permite index.js + [id].js separados).
function toJson(r) {
  return { id: String(r.id), cod: r.cod, nome: r.nome, cat: r.cat, un: r.un, preco: Number(r.preco), prazo: r.prazo };
}

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();
    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (id === undefined) {
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
    }

    if (req.method === 'PUT') {
      const b = req.body || {};
      const rows = await sql`
        UPDATE servicos SET
          cod = ${b.cod || ''}, nome = ${b.nome}, cat = ${b.cat || ''}, un = ${b.un || ''},
          preco = ${Number(b.preco) || 0}, prazo = ${b.prazo || ''}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'servico nao encontrado' });
      return res.status(200).json(toJson(rows[0]));
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM servicos WHERE id = ${id}`;
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
