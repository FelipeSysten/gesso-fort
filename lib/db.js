const { neon } = require('@neondatabase/serverless');

let cached = null;

// Le a connection string apenas quando alguma rota realmente precisar do banco,
// para uma requisicao nao derrubar a funcao inteira se DATABASE_URL ainda nao
// tiver sido configurada nas variaveis de ambiente da Vercel.
function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    const err = new Error('DATABASE_URL nao configurada nas variaveis de ambiente.');
    err.code = 'DB_NOT_CONFIGURED';
    throw err;
  }
  if (!cached) cached = neon(url);
  return cached;
}

module.exports = { getSql };
