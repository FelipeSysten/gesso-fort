const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');
const { formatDataBR } = require('../../lib/format');

// Rota unica para /api/notas e /api/notas/:id — consolidada a partir de
// index.js + [id].js para caber no limite de 12 Serverless Functions do plano
// Hobby da Vercel.
function toJson(r) {
  return {
    id: String(r.id),
    numero: r.numero,
    tipo: r.tipo,
    cliente: r.cliente_id === null ? null : String(r.cliente_id),
    itens: r.itens,
    desc: Number(r.desconto),
    obs: r.obs,
    sit: r.sit,
    validade: r.validade,
    data: formatDataBR(r.created_at)
  };
}

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();
    const idParam = req.query.id;
    const id = Array.isArray(idParam) ? idParam[0] : idParam;

    if (id === undefined) {
      if (req.method === 'GET') {
        const rows = await sql`SELECT * FROM notas ORDER BY created_at DESC`;
        return res.status(200).json(rows.map(toJson));
      }

      if (req.method === 'POST') {
        const b = req.body || {};
        if (!b.tipo || !Array.isArray(b.itens) || !b.itens.length) {
          return res.status(400).json({ error: 'tipo e itens sao obrigatorios' });
        }
        const clienteId = b.clienteId ? parseInt(b.clienteId, 10) : null;
        const itensJson = JSON.stringify(b.itens);
        const inserted = await sql`
          INSERT INTO notas (tipo, cliente_id, itens, desconto, obs, sit, validade)
          VALUES (${b.tipo}, ${Number.isNaN(clienteId) ? null : clienteId}, ${itensJson}::jsonb, ${Number(b.desc) || 0}, ${b.obs || ''}, 'Pendente', '')
          RETURNING id
        `;
        const insertedId = inserted[0].id;
        const numero = String(insertedId).padStart(6, '0');
        const rows = await sql`UPDATE notas SET numero = ${numero} WHERE id = ${insertedId} RETURNING *`;
        return res.status(201).json(toJson(rows[0]));
      }

      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end();
    }

    if (req.method === 'PATCH') {
      const b = req.body || {};
      // clienteId so e alterado quando enviado (edicao completa); em um PATCH so de
      // status (ex: cancelar) o campo vem ausente e o cliente atual e preservado.
      const clienteIdParsed = b.clienteId ? parseInt(b.clienteId, 10) : null;
      const novoClienteId = Object.prototype.hasOwnProperty.call(b, 'clienteId')
        ? (Number.isNaN(clienteIdParsed) ? null : clienteIdParsed)
        : null;
      const itensJson = Array.isArray(b.itens) ? JSON.stringify(b.itens) : null;
      const rows = await sql`
        UPDATE notas SET
          sit = COALESCE(${b.sit ?? null}, sit),
          tipo = COALESCE(${b.tipo ?? null}, tipo),
          cliente_id = COALESCE(${novoClienteId}, cliente_id),
          obs = COALESCE(${b.obs ?? null}, obs),
          desconto = COALESCE(${b.desc ?? null}, desconto),
          itens = COALESCE(${itensJson}::jsonb, itens)
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'documento nao encontrado' });
      return res.status(200).json(toJson(rows[0]));
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
