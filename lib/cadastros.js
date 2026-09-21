// Config para os endpoints genericos api/cadastros/[modulo] — um por modulo
// "gd:" de sistema.html (gdefs). A chave de cada entrada é o nome usado na
// URL (/api/cadastros/<modulo>) e também o nome da tabela no banco.
// `cols` lista os campos editáveis, na mesma ordem/chave usada em gdefs[modulo].cols.
// `numeric` marca os campos que devem ser gravados como número (coluna NUMERIC).
// `dbCols` remapeia uma chave do frontend para um nome de coluna diferente,
// usado só quando a chave colide com palavra reservada do SQL (desc, user).

const CADASTROS = {
  fornecedores: { cols: ['cod', 'nome', 'cnpj', 'contato', 'cidade', 'tel', 'ultima'] },
  transportadoras: { cols: ['cod', 'nome', 'cnpj', 'veiculo', 'cidade', 'tel'] },
  vendedores: { cols: ['cod', 'nome', 'com', 'meta', 'vendas', 'sit'], numeric: ['meta', 'vendas'] },
  pedcompra: { cols: ['num', 'emissao', 'forn', 'itens', 'total', 'previsao', 'sit'], numeric: ['total'] },
  notaentrada: { cols: ['nf', 'chave', 'forn', 'emissao', 'itens', 'valor', 'sit'], numeric: ['valor'] },
  mde: { cols: ['chave', 'forn', 'emissao', 'valor', 'sit'], numeric: ['valor'] },
  faturamento: { cols: ['num', 'cliente', 'emissao', 'venc', 'valor', 'forma', 'sit'], numeric: ['valor'] },
  receber: { cols: ['doc', 'cliente', 'venc', 'valor', 'recebido', 'sit'], numeric: ['valor', 'recebido'] },
  pagar: { cols: ['doc', 'forn', 'venc', 'valor', 'cat', 'sit'], numeric: ['valor'] },
  banco: { cols: ['data', 'conta', 'hist', 'tipo', 'valor', 'saldo'], numeric: ['valor', 'saldo'] },
  agenda: { cols: ['data', 'comp', 'cliente', 'resp', 'sit'] },
  tributacoes: { cols: ['cod', 'desc', 'cst', 'cfop', 'icms', 'pis', 'cofins'], dbCols: { desc: 'descricao' } },
  cfop: { cols: ['cod', 'desc', 'tipo', 'aplic'], dbCols: { desc: 'descricao' } },
  boletos: { cols: ['nosso', 'cliente', 'venc', 'valor', 'banco', 'sit'], numeric: ['valor'] },
  xmls: { cols: ['chave', 'tipo', 'emissao', 'valor', 'sit'], numeric: ['valor'] },
  usuarios: { cols: ['user', 'nome', 'grupo', 'acesso', 'sit'], dbCols: { user: 'usuario' } },
  grupos: { cols: ['grupo', 'desc', 'users', 'perms'], dbCols: { desc: 'descricao' } },
  caixa: { cols: ['hora', 'hist', 'forma', 'tipo', 'valor'], numeric: ['valor'] }
};

function getEntry(modulo) {
  const entry = CADASTROS[modulo];
  return entry ? { table: modulo, ...entry } : null;
}

// Identificador entre aspas duplas — seguro aqui porque `table`/`col` sempre
// vêm do config acima (nunca de entrada do usuário sem passar pelo whitelist).
function qi(id) {
  return '"' + String(id).replace(/"/g, '""') + '"';
}

function dbCol(entry, key) {
  return (entry.dbCols && entry.dbCols[key]) || key;
}

function coerce(entry, key, v) {
  if (entry.numeric && entry.numeric.indexOf(key) >= 0) return Number(v) || 0;
  return v === undefined || v === null ? '' : v;
}

function toJson(entry, row) {
  const out = { id: String(row.id) };
  entry.cols.forEach((key) => {
    const v = row[dbCol(entry, key)];
    // colunas NUMERIC voltam do driver como string (evita perda de precisão) —
    // convertidas aqui para número, senão viram concatenação de texto no front.
    out[key] = entry.numeric && entry.numeric.indexOf(key) >= 0 ? Number(v) : v;
  });
  return out;
}

module.exports = { CADASTROS, getEntry, qi, dbCol, coerce, toJson };
