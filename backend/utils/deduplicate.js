// backend/utils/deduplicate.js

function deduplicateByLinkAfiliadoKeepLatest(products) {
  const map = new Map();

  for (const product of products) {
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
