// backend/utils/deduplicate.js

function isPrecoZero(preco) {
  if (preco === null || preco === undefined) return true;

  if (typeof preco === 'number') {
    return preco === 0;
  }

  if (typeof preco === 'string') {
    const invalido = preco.toLowerCase().trim();

    // Verifica valores inválidos diretos
    const invalidos = [
      'não disponível',
      'nao disponivel',
      'indisponível',
      'indisponivel',
      '',
      '-',
      'null',
      'undefined',
    ];

    if (invalidos.includes(invalido)) {
      return true;
    }

    // Remove R$, espaços, vírgulas, pontos, HTML e verifica se é zero
    const limpo = invalido
      .replace(/<\/?[^>]+(>|$)/g, '')   // remove tags HTML
      .replace(/&nbsp;/gi, '')          // remove entidades HTML
      .replace(/\s/g, '')               // remove espaços
      .replace(/r\$/gi, '')             // remove R$
      .replace(/[.,]/g, '')             // remove pontuação
      .trim();

    return /^0+$/.test(limpo);
  }

  return true;
}

function deduplicateByLinkAfiliadoKeepLatest(products) {
  const map = new Map();

  for (const product of products) {
    const preco = product.preco_para;

    if (isPrecoZero(preco)) {
      console.log(`[REMOVIDO] Preço inválido →`, preco, '| Produto:', product.nome);
      continue;
    }

    const key = product.link_afiliado;

    if (!map.has(key)) {
      map.set(key, product);
    } else {
      const existing = map.get(key);
      const newDate = new Date(product.ultima_verificacao || product.updatedAt || 0);
      const existingDate = new Date(existing.ultima_verificacao || existing.updatedAt || 0);

      if (newDate > existingDate) {
        map.set(key, product);
      }
    }
  }

  return Array.from(map.values());
}

module.exports = { deduplicateByLinkAfiliadoKeepLatest };
