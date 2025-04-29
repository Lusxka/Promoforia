// backend/routes/productRoutes.js
const express = require('express');
const Product = require('../models/Product'); // Importa o modelo
const router = express.Router();

// Rota GET para buscar todos os produtos
// GET /api/products
router.get('/', async (req, res) => {
    try {
        // Busca todos os documentos na coleção 'mercado_livre_relampago'
        const products = await Product.find({});
        res.json(products); // Retorna os produtos como JSON
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
    }
});

// Você pode adicionar mais rotas aqui (ex: buscar por ID, etc.)

module.exports = router;