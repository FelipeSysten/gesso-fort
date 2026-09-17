function formatDataBR(dateLike) {
  const d = new Date(dateLike);
  const data = d.toLocaleDateString('pt-BR', { timeZone: 'America/Bahia' });
  const hora = d.toLocaleTimeString('pt-BR', { timeZone: 'America/Bahia', hour: '2-digit', minute: '2-digit' });
  return data + ' ' + hora;
}

module.exports = { formatDataBR };
