// src/types/Product.ts
// Define o tipo que o frontend usa APÓS processar os dados do backend
export interface Product {
  _id: string; // Mapeado do _id do BackendProduct
  name: string; // Mapeado de nome
  description: string; // Derivado ou placeholder (não vem do backend)
  price: number; // Mapeado e convertido de preco_para
  originalPrice?: number; // Mapeado e convertido de preco_de (opcional)
  discount?: number; // Mapeado e convertido de desconto (opcional)
  images: string[]; // Mapeado e convertido de imagens (string para array)
  categorySlug: string; // Derivado de categoria (slug)
  backendCategory?: string; // Manter o nome original da categoria do backend (opcional)
  tags: string[]; // Placeholder (não vem do backend)
  rating: number; // Mapeado e convertido de avaliacao
  reviewCount: number; // Mapeado e convertido de numero_avaliacoes
  stockQuantity: number; // Placeholder (não vem do backend)
  sellerName?: string; // Mapeado de vendedor (opcional)
  affiliateLink: string; // Mapeado de link_afiliado
  featured?: boolean; // Derivado (não vem do backend)
  bestseller?: boolean; // Derivado (não vem do backend)
  new?: boolean; // Derivado (não vem do backend)

  // Adicionar outros campos do backend que possam ser úteis, se desejar manter:
  frete?: string;
  parcelas?: string;
  tempo_restante?: string;
  porcentagem_vendida?: number; // Convertido de string
  preco_exterior?: number; // Convertido de string
  ultima_verificacao?: Date; // Convertido se possível, ou manter string
}