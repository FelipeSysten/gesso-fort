-- Gesso Fort — schema minimo para leads, clientes e notas (orcamentos/pedidos/OS).
-- Rode este arquivo uma vez no console SQL do seu banco Postgres (Vercel Postgres / Neon)
-- antes de usar o sistema com dados reais.

CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  protocolo TEXT UNIQUE,
  nome TEXT NOT NULL,
  tel TEXT NOT NULL,
  cidade TEXT DEFAULT '',
  servico TEXT DEFAULT '',
  metragem TEXT DEFAULT '',
  obs TEXT DEFAULT '',
  sit TEXT NOT NULL DEFAULT 'Novo',
  origem TEXT NOT NULL DEFAULT 'Site',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS clientes (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  fantasia TEXT DEFAULT '—',
  contato TEXT DEFAULT '',
  doc TEXT DEFAULT '—',
  tel TEXT DEFAULT '',
  cel TEXT DEFAULT '',
  municipio TEXT DEFAULT '',
  uf TEXT DEFAULT 'BA',
  ativo TEXT DEFAULT 'Sim',
  dt_compra TEXT DEFAULT '—',
  nasc TEXT DEFAULT '—',
  rua TEXT DEFAULT '',
  num TEXT DEFAULT '',
  bairro TEXT DEFAULT '',
  cep TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notas (
  id SERIAL PRIMARY KEY,
  numero TEXT,
  tipo TEXT NOT NULL,
  cliente_id INTEGER,
  itens JSONB NOT NULL DEFAULT '[]',
  desconto NUMERIC NOT NULL DEFAULT 0,
  obs TEXT DEFAULT '',
  sit TEXT NOT NULL DEFAULT 'Pendente',
  validade TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
