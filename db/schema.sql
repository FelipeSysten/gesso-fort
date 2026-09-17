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

-- Dados de demonstracao (os mesmos que ja aparecem no mockup) para o sistema
-- nao ficar vazio assim que o banco for conectado. Pode apagar/editar a vontade.
-- O WHERE NOT EXISTS evita duplicar os registros se este arquivo for rodado mais de uma vez.
INSERT INTO clientes (nome, fantasia, contato, doc, tel, cel, municipio, uf, ativo, dt_compra, nasc, rua, num, bairro, cep, endereco)
SELECT * FROM (VALUES
  ('Construtora Vale Verde LTDA', 'Vale Verde', 'Eng. Rafael Musa', '12.884.301/0001-45', '(73) 3613-2200', '(73) 99114-2200', 'Itabuna', 'BA', 'Sim', '09/09/2026', '—', 'Av. Cinquentenário', '1120', 'Centro', '45600-000', 'Av. Cinquentenário, 1120 — Itabuna, BA'),
  ('Marcos Antônio Silveira', '—', 'Marcos', '842.115.905-30', '(73) 3615-7702', '(73) 99814-7702', 'Itabuna', 'BA', 'Sim', '04/09/2026', '14/03/1984', 'Rua do Cajueiro', '45', 'São Caetano', '45604-095', 'Rua do Cajueiro, 45 — Itabuna, BA'),
  ('Residencial Parque das Palmeiras', 'Palmeiras', 'Síndica Ana Lima', '29.774.180/0001-08', '(73) 3212-9080', '(73) 98800-9080', 'Ilhéus', 'BA', 'Sim', '02/09/2026', '—', 'Rod. Ilhéus-Itabuna', 'km 8', 'Iguape', '45650-000', 'Rod. Ilhéus-Itabuna, km 8 — Ilhéus, BA'),
  ('Juliana Ferraz Andrade', '—', 'Juliana', '017.552.335-91', '—', '(73) 98123-4455', 'Itabuna', 'BA', 'Não', '31/08/2026', '02/11/1991', 'Rua Nina Barreto', '210', 'Alto Maron', '45605-000', 'Rua Nina Barreto, 210 — Itabuna, BA')
) AS seed(nome, fantasia, contato, doc, tel, cel, municipio, uf, ativo, dt_compra, nasc, rua, num, bairro, cep, endereco)
WHERE NOT EXISTS (SELECT 1 FROM clientes);
