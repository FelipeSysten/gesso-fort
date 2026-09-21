-- Rode isso UMA VEZ no SQL editor do Neon se voce chegou a rodar uma versao
-- anterior do schema.sql (ela inseria 4 clientes ficticios de demonstracao).
-- Seguro de rodar mesmo se esses registros ja nao existirem (so remove pelo
-- nome exato, nao apaga nada digitado por voce).

DELETE FROM clientes WHERE nome IN (
  'Construtora Vale Verde LTDA',
  'Marcos Antônio Silveira',
  'Residencial Parque das Palmeiras',
  'Juliana Ferraz Andrade'
);
