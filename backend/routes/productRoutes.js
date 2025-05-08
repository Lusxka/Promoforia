// backend/routes/productRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const productBaseSchema = require('../models/ProductBaseSchema'); // Supondo que você criou/adaptou para ProductBaseSchema.js

const router = express.Router();

// Nomes das suas coleções MongoDB
const COLLECTIONS = {
    RELAMPAGO: "mercado_livre_relampago",
    OFERTAS: "mercado_livre_todas", // Para "Ofertas"
    MENOS_100: "mercado_livre_menos_100",
    COMPRA_MES: "mercado_livre_compra_mes",
    MODA: "mercado_livre_moda"
};

// Helper para obter um modelo para uma coleção específica
const getProductModelForCollection = (collectionName) => {
    // Evita redefinir modelos se já existem, o que pode causar erro em alguns casos
    if (mongoose.models[collectionName]) {
        return mongoose.models[collectionName];
    }
    // Usa collectionName como o nome do modelo E o nome da coleção no DB
    return mongoose.model(collectionName, productBaseSchema, collectionName);
};

// ROTA ANTIGA - Agora podemos decidir se ela busca de uma coleção default ou se torna obsoleta
// GET /api/products (ATENÇÃO: Decida o que esta rota fará. Talvez redirecionar para /all-collections?)
router.get('/', async (req, res) => {
    console.log(">>> Rota GET /api/products (genérica) atingida!"); // DEBUG
    try {
        console.warn("A rota GET /api/products foi chamada sem um alvo específico. Considere usar /all-collections ou /collection/:collectionName");
        res.status(400).json({ message: 'Endpoint genérico de produtos. Por favor, especifique /all-collections ou /collection/:collectionName.' });
    } catch (error) {
        console.error('Erro ao buscar produtos (rota genérica):', error);
        res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
    }
});

// ROTA QUE O FRONTEND ESTÁ TENTANDO ACESSAR: Buscar todos os produtos de TODAS as coleções relevantes
// GET /api/products/all-collections
router.get('/all-collections', async (req, res) => {
    // ADIÇÃO PARA DEBUG: Logar quando a rota é atingida
    console.log(">>> Rota GET /api/products/all-collections atingida!");

    try {
        let allProducts = [];
        const collectionNames = Object.values(COLLECTIONS);

        if (collectionNames.length === 0) {
             console.warn("COLLECTIONS está vazio. Nenhuma coleção para buscar."); // DEBUG
             return res.json([]); // Retorna array vazio se não houver coleções definidas
        }

        // Verificar estado da conexão MongoDB (opcional, mas útil para depurar)
        if (mongoose.connection.readyState !== 1) {
             console.error(`MongoDB não conectado. Ready state: ${mongoose.connection.readyState}`); // DEBUG
             // Poderia retornar um erro 500 aqui se a conexão for essencial antes de tentar qualquer busca
             // return res.status(500).json({ message: 'Banco de dados não conectado.' });
        }


        for (const collectionName of collectionNames) {
            try { // Adicionado try/catch interno para buscar cada coleção individualmente
                console.log(`Tentando buscar da coleção: ${collectionName}`); // DEBUG
                const ProductModel = getProductModelForCollection(collectionName);
                const productsFromCollection = await ProductModel.find({}).lean(); // .lean() para performance
                console.log(`Encontrados ${productsFromCollection.length} produtos em ${collectionName}`); // DEBUG
                // Adicionar um identificador da coleção de origem, se necessário para o frontend
                productsFromCollection.forEach(p => p.source_collection = collectionName);
                allProducts = allProducts.concat(productsFromCollection);
            } catch (innerError) {
                console.error(`Erro INERNO ao buscar da coleção ${collectionName}:`, innerError); // DEBUG erro específico da coleção
                // Dependendo da sua lógica, pode querer lançar o erro aqui
                // para que o catch externo o pegue e retorne um 500 geral.
                // Se quiser continuar buscando as outras coleções mesmo que uma falhe, mantenha este catch interno.
            }
        }

        console.log(`Total de produtos encontrados em todas as coleções: ${allProducts.length}`); // DEBUG
        res.json(allProducts); // Responder com os produtos encontrados
    } catch (error) {
        console.error('Erro GLOBAL ao buscar todos os produtos de todas as coleções:', error); // DEBUG erro geral
        res.status(500).json({ message: 'Erro interno do servidor ao buscar todos os produtos.' });
    }
});

// ROTA PARA COLEÇÃO ESPECÍFICA: Buscar produtos de UMA coleção específica
// GET /api/products/collection/:collectionName
router.get('/collection/:collectionName', async (req, res) => {
    const { collectionName } = req.params;

    // ADIÇÃO PARA DEBUG: Logar quando a rota de coleção específica é atingida
    console.log(`>>> Rota GET /api/products/collection/${collectionName} atingida!`); // DEBUG

    // Validar se collectionName é um dos permitidos para segurança
    if (!Object.values(COLLECTIONS).includes(collectionName)) {
        console.warn(`Coleção solicitada '${collectionName}' não encontrada ou não permitida.`); // DEBUG
        return res.status(404).json({ message: 'Coleção não encontrada ou não permitida.' });
    }

    try {
        console.log(`Tentando buscar da coleção específica: ${collectionName}`); // DEBUG
        const ProductModel = getProductModelForCollection(collectionName);
        const products = await ProductModel.find({}).lean();
        console.log(`Encontrados ${products.length} produtos na coleção ${collectionName}`); // DEBUG
        // Adicionar um identificador da coleção de origem, se necessário para o frontend
        products.forEach(p => p.source_collection = collectionName);
        res.json(products);
    } catch (error) {
        console.error(`Erro ao buscar produtos da coleção ${collectionName}:`, error); // DEBUG
        res.status(500).json({ message: `Erro interno do servidor ao buscar produtos da coleção ${collectionName}.` });
    }
});

module.exports = router;