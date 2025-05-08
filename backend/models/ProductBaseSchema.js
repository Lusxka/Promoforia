// backend/models/ProductBaseSchema.js (NOVO ou adapte o seu Product.js)
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // Defina aqui TODOS os campos que vêm do MongoDB ANTES do processamento do frontend
    // Exemplo baseado no seu src/types/Product.ts, mas como eles ESTÃO no MongoDB
    nome: String,
    preco_para: Number,
    preco_de: Number,
    desconto: Number, // ou String se vier assim
    imagens: [String], // ou uma String que você converte no frontend
    categoria: String, // O nome da categoria como vem do backend
    avaliacao: Number,
    numero_avaliacoes: Number,
    vendedor: String, // ou um objeto { name: String }
    link_afiliado: String,
    // Outros campos que existem nas suas coleções MongoDB
    // frete: String,
    // parcelas: String,
    // tempo_restante: String,
    // porcentagem_vendida: String, // Note que no frontend é Number
    // preco_exterior: String,     // Note que no frontend é Number
    // ultima_verificacao: String, // ou Date
}, { strict: false }); // strict: false pode ser útil se as coleções variarem um pouco

// NÃO criamos um modelo default aqui para todas as operações
// module.exports = mongoose.model('Product', productSchema); // Linha antiga
module.exports = productSchema; // Exportamos apenas o schema