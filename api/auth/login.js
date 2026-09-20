const { setSessionCookie } = require('../../lib/auth');

// Senha compartilhada da retaguarda. Defina SISTEMA_SENHA nas variaveis de
// ambiente do projeto na Vercel antes de ir para producao — sem isso, o
// valor abaixo e usado como senha padrao (apenas para nao travar o primeiro deploy).
const SENHA_PADRAO = 'gessofort2026';

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }
  const { senha, manter } = req.body || {};
  const esperado = process.env.SISTEMA_SENHA || SENHA_PADRAO;
  if (!senha || senha !== esperado) {
    return res.status(401).json({ error: 'Usuário ou senha incorretos.' });
  }
  setSessionCookie(res, !!manter);
  return res.status(200).json({ ok: true });
};
