const { getSql } = require('../../lib/db');
const { isAuthed } = require('../../lib/auth');
const { formatDataBR } = require('../../lib/format');

module.exports = async (req, res) => {
  try {
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
      const id = inserted[0].id;
      const protocolo = 'GF-' + new Date().getFullYear() + '-' + String(id).padStart(3, '0');
      await sql`UPDATE leads SET protocolo = ${protocolo} WHERE id = ${id}`;
      return res.status(201).json({ id, protocolo });
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
