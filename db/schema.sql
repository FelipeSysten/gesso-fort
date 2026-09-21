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

-- Catálogo (Cadastros > Produtos / Serviços) — api/produtos e api/servicos.

CREATE TABLE IF NOT EXISTS produtos (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  nome TEXT NOT NULL,
  cat TEXT DEFAULT '',
  un TEXT DEFAULT '',
  preco NUMERIC NOT NULL DEFAULT 0,
  estoque NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS servicos (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  nome TEXT NOT NULL,
  cat TEXT DEFAULT '',
  un TEXT DEFAULT '',
  preco NUMERIC NOT NULL DEFAULT 0,
  prazo TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Módulos genéricos de listagem/cadastro (menus Cadastros, Compras, Vendas,
-- Financeiro e Utilitários que usam o sistema "gd:" em sistema.html).
-- Todos são servidos por api/cadastros/[modulo], mapeado em lib/cadastros.js
-- — o nome de cada tabela abaixo é a própria chave "modulo" usada na API
-- (ex.: GET /api/cadastros/fornecedores lê a tabela "fornecedores").

CREATE TABLE IF NOT EXISTS fornecedores (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  nome TEXT DEFAULT '',
  cnpj TEXT DEFAULT '',
  contato TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  tel TEXT DEFAULT '',
  ultima TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS transportadoras (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  nome TEXT DEFAULT '',
  cnpj TEXT DEFAULT '',
  veiculo TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  tel TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS vendedores (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  nome TEXT DEFAULT '',
  com TEXT DEFAULT '',
  meta NUMERIC NOT NULL DEFAULT 0,
  vendas NUMERIC NOT NULL DEFAULT 0,
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pedcompra (
  id SERIAL PRIMARY KEY,
  num TEXT DEFAULT '',
  emissao TEXT DEFAULT '',
  forn TEXT DEFAULT '',
  itens TEXT DEFAULT '',
  total NUMERIC NOT NULL DEFAULT 0,
  previsao TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS notaentrada (
  id SERIAL PRIMARY KEY,
  nf TEXT DEFAULT '',
  chave TEXT DEFAULT '',
  forn TEXT DEFAULT '',
  emissao TEXT DEFAULT '',
  itens TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS mde (
  id SERIAL PRIMARY KEY,
  chave TEXT DEFAULT '',
  forn TEXT DEFAULT '',
  emissao TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faturamento (
  id SERIAL PRIMARY KEY,
  num TEXT DEFAULT '',
  cliente TEXT DEFAULT '',
  emissao TEXT DEFAULT '',
  venc TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  forma TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS receber (
  id SERIAL PRIMARY KEY,
  doc TEXT DEFAULT '',
  cliente TEXT DEFAULT '',
  venc TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  recebido NUMERIC NOT NULL DEFAULT 0,
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pagar (
  id SERIAL PRIMARY KEY,
  doc TEXT DEFAULT '',
  forn TEXT DEFAULT '',
  venc TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  cat TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS banco (
  id SERIAL PRIMARY KEY,
  data TEXT DEFAULT '',
  conta TEXT DEFAULT '',
  hist TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  saldo NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agenda (
  id SERIAL PRIMARY KEY,
  data TEXT DEFAULT '',
  comp TEXT DEFAULT '',
  cliente TEXT DEFAULT '',
  resp TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tributacoes (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  descricao TEXT DEFAULT '',
  cst TEXT DEFAULT '',
  cfop TEXT DEFAULT '',
  icms TEXT DEFAULT '',
  pis TEXT DEFAULT '',
  cofins TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cfop (
  id SERIAL PRIMARY KEY,
  cod TEXT DEFAULT '',
  descricao TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  aplic TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS boletos (
  id SERIAL PRIMARY KEY,
  nosso TEXT DEFAULT '',
  cliente TEXT DEFAULT '',
  venc TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  banco TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS xmls (
  id SERIAL PRIMARY KEY,
  chave TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  emissao TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  usuario TEXT DEFAULT '',
  nome TEXT DEFAULT '',
  grupo TEXT DEFAULT '',
  acesso TEXT DEFAULT '',
  sit TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grupos (
  id SERIAL PRIMARY KEY,
  grupo TEXT DEFAULT '',
  descricao TEXT DEFAULT '',
  users TEXT DEFAULT '',
  perms TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS caixa (
  id SERIAL PRIMARY KEY,
  hora TEXT DEFAULT '',
  hist TEXT DEFAULT '',
  forma TEXT DEFAULT '',
  tipo TEXT DEFAULT '',
  valor NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
