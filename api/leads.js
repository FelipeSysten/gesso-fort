const { getSql } = require('../lib/db');
const { isAuthed } = require('../lib/auth');
const { formatDataBR } = require('../lib/format');

// /api/leads atende lista (GET, autenticado) e criacao (POST, publico — vem
// do formulario do site). /api/leads?id=5 atende PATCH de situacao (autenticado).
module.exports = async (req, res) => {
  try {
    const { id } = req.query;

    if (id === undefined) {
      if (req.method === 'GET') {
        if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
        const sql = getSql();
        const rows = await sql`SELECT * FROM leads ORDER BY created_at DESC`;
        return res.status(200).json(
          rows.map((r) => ({
            id: r.id,
            protocolo: r.protocolo,
            nome: r.nome,
            tel: r.tel,
            cidade: r.cidade,
            servico: r.servico,
            metragem: r.metragem,
            obs: r.obs,
            sit: r.sit,
            origem: r.origem,
            data: formatDataBR(r.created_at)
          }))
        );
      }

      if (req.method === 'POST') {
        const body = req.body || {};
        const nome = (body.nome || '').trim();
        const tel = (body.tel || '').trim();
        if (!nome || !tel) {
          return res.status(400).json({ error: 'Informe pelo menos nome e WhatsApp.' });
        }
        const cidade = (body.cidade || '').trim();
        const servico = body.servico || '';
        const metragem = (body.metragem || '').trim();
        const obs = (body.obs || '').trim();

        const sql = getSql();
        const inserted = await sql`
          INSERT INTO leads (nome, tel, cidade, servico, metragem, obs, sit, origem)
          VALUES (${nome}, ${tel}, ${cidade}, ${servico}, ${metragem}, ${obs}, 'Novo', 'Site')
          RETURNING id
        `;
        const insertedId = inserted[0].id;
        const protocolo = 'GF-' + new Date().getFullYear() + '-' + String(insertedId).padStart(3, '0');
        await sql`UPDATE leads SET protocolo = ${protocolo} WHERE id = ${insertedId}`;
        return res.status(201).json({ id: insertedId, protocolo });
      }

      res.setHeader('Allow', 'GET, POST');
      return res.status(405).end();
    }

    if (!isAuthed(req)) return res.status(401).json({ error: 'unauthorized' });
    const sql = getSql();

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
