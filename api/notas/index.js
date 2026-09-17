const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');
const { formatDataBR } = require('../../lib/format');

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
      const id = inserted[0].id;
      const numero = String(id).padStart(6, '0');
      const rows = await sql`UPDATE notas SET numero = ${numero} WHERE id = ${id} RETURNING *`;
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
