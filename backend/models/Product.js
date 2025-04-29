// backend/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    nome: { type: String, required: true },
    avaliacao: { type: String }, // Ou Number se for sempre numérico
    categoria: { type: String },
    desconto: { type: String },
    frete: { type: String },
    imagens: { type: String }, // Parece ser uma URL única na imagem. Se puder ser um array, use [String]
    link_afiliado: { type: String, unique: true }, // Link parece ser um bom identificador único
    numero_avaliacoes: { type: String }, // Ou Number
    parcelas: { type: String },
    porcentagem_vendida: { type: String }, // Ou Number
    preco_exterior: { type: String }, // Ou Number
    preco_de: { type: String }, // Ou Number
    preco_para: { type: String, required: true }, // Ou Number
    tempo_restante: { type: String },
    ultima_verificacao: { type: Date },
    vendedor: { type: String },
    // Adicione outros campos se necessário
}, {
    timestamps: true, // Adiciona createdAt e updatedAt automaticamente
    // Importante: Especifique a coleção exata se o nome do modelo no plural não for igual
    collection: 'mercado_livre_relampago'
});

// Criar um índice no link_afiliado pode melhorar a performance de busca se você buscar por ele
// productSchema.index({ link_afiliado: 1 });

module.exports = mongoose.model('Product', productSchema);