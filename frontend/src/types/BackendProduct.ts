// src/types/BackendProduct.ts
// Define o tipo conforme retornado pelo seu backend
export interface BackendProduct {
    _id: string;
    nome: string;
    avaliacao?: string; // String no backend
    categoria?: string;
    desconto?: string; // String no backend (ex: "15%" ou "15")
    frete?: string;
    imagens?: string; // String única URL no backend
    link_afiliado: string; // Chave única no backend
    numero_avaliacoes?: string; // String no backend (ex: "120")
    parcelas?: string;
    porcentagem_vendida?: string; // String no backend
    preco_exterior?: string; // String no backend
    preco_de?: string; // String no backend (ex: "R$ 150,00")
    preco_para: string; // String no backend (ex: "R$ 120,00"), required
    tempo_restante?: string;
    ultima_verificacao?: string; // Ou Date, dependendo da formatação no backend
    vendedor?: string;
    createdAt?: string; // Timestamps do Mongoose
    updatedAt?: string; // Timestamps do Mongoose
}