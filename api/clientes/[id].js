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
    const { id } = req.query;

    if (req.method === 'PUT') {
      const b = req.body || {};
      const rows = await sql`
        UPDATE clientes SET
          nome = ${b.nome}, fantasia = ${b.fantasia || '—'}, contato = ${b.contato || ''}, doc = ${b.doc || '—'},
          tel = ${b.tel || ''}, cel = ${b.cel || ''}, municipio = ${b.municipio || ''}, uf = ${b.uf || 'BA'},
          ativo = ${b.ativo || 'Sim'}, dt_compra = ${b.dtCompra || '—'}, nasc = ${b.nasc || '—'},
          rua = ${b.rua || ''}, num = ${b.num || ''}, bairro = ${b.bairro || ''}, cep = ${b.cep || ''}, endereco = ${b.end || ''}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!rows.length) return res.status(404).json({ error: 'cliente nao encontrado' });
      return res.status(200).json(toJson(rows[0]));
    }

    if (req.method === 'DELETE') {
      await sql`DELETE FROM clientes WHERE id = ${id}`;
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
