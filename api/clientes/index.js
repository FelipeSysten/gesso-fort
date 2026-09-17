const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');

function toJson(r) {
  return {
    id: String(r.id),
    nome: r.nome,
    fantasia: r.fantasia,
    contato: r.contato,
    doc: r.doc,
    tel: r.tel,
    cel: r.cel,
    municipio: r.municipio,
    uf: r.uf,
    ativo: r.ativo,
    dtCompra: r.dt_compra,
    nasc: r.nasc,
    rua: r.rua,
    num: r.num,
    bairro: r.bairro,
    cep: r.cep,
    end: r.endereco
  };
}

module.exports = async (req, res) => {
  try {
    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM clientes ORDER BY created_at DESC`;
      return res.status(200).json(rows.map(toJson));
    }

    if (req.method === 'POST') {
      const b = req.body || {};
      if (!b.nome) return res.status(400).json({ error: 'nome obrigatorio' });
      const rows = await sql`
        INSERT INTO clientes (nome, fantasia, contato, doc, tel, cel, municipio, uf, ativo, dt_compra, nasc, rua, num, bairro, cep, endereco)
        VALUES (${b.nome}, ${b.fantasia || '—'}, ${b.contato || ''}, ${b.doc || '—'}, ${b.tel || ''}, ${b.cel || ''},
                ${b.municipio || ''}, ${b.uf || 'BA'}, ${b.ativo || 'Sim'}, ${b.dtCompra || '—'}, ${b.nasc || '—'},
                ${b.rua || ''}, ${b.num || ''}, ${b.bairro || ''}, ${b.cep || ''}, ${b.end || ''})
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
