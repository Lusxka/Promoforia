// backend/routes/productRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const productBaseSchema = require('../models/ProductBaseSchema');
const { deduplicateByLinkAfiliadoKeepLatest } = require('../utils/deduplicate');

const router = express.Router();

const COLLECTIONS = {
  RELAMPAGO: "mercado_livre_relampago",
  OFERTAS: "mercado_livre_todas",
  MENOS_100: "mercado_livre_menos_100",
  COMPRA_MES: "mercado_livre_compra_mes",
  MODA: "mercado_livre_moda"
};

const getProductModelForCollection = (collectionName) => {
  if (mongoose.models[collectionName]) {
    return mongoose.models[collectionName];
  }
  return mongoose.model(collectionName, productBaseSchema, collectionName);
};

router.get('/', async (req, res) => {
  console.log(">>> Rota GET /api/products (genérica) atingida!");
  try {
    console.warn("A rota GET /api/products foi chamada sem um alvo específico. Considere usar /all-collections ou /collection/:collectionName");
    res.status(400).json({ message: 'Endpoint genérico de produtos. Por favor, especifique /all-collections ou /collection/:collectionName.' });
  } catch (error) {
    console.error('Erro ao buscar produtos (rota genérica):', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar produtos.' });
  }
});

router.get('/all-collections', async (req, res) => {
  console.log(">>> Rota GET /api/products/all-collections atingida!");

  try {
    let allProducts = [];
    const collectionNames = Object.values(COLLECTIONS);

    if (collectionNames.length === 0) {
      console.warn("COLLECTIONS está vazio. Nenhuma coleção para buscar.");
      return res.json([]);
    }

    if (mongoose.connection.readyState !== 1) {
      console.error(`MongoDB não conectado. Ready state: ${mongoose.connection.readyState}`);
    }

    for (const collectionName of collectionNames) {
      try {
        console.log(`Tentando buscar da coleção: ${collectionName}`);
        const ProductModel = getProductModelForCollection(collectionName);
        const productsFromCollection = await ProductModel.find({}).lean();
        console.log(`Encontrados ${productsFromCollection.length} produtos em ${collectionName}`);
        productsFromCollection.forEach(p => p.source_collection = collectionName);
        allProducts = allProducts.concat(productsFromCollection);
      } catch (innerError) {
        console.error(`Erro INERNO ao buscar da coleção ${collectionName}:`, innerError);
      }
    }

    const produtosFiltrados = deduplicateByLinkAfiliadoKeepLatest(allProducts);
    console.log(`Total após remoção de duplicados e R$ 0: ${produtosFiltrados.length}`);

    res.json(produtosFiltrados);
  } catch (error) {
    console.error('Erro GLOBAL ao buscar todos os produtos de todas as coleções:', error);
    res.status(500).json({ message: 'Erro interno do servidor ao buscar todos os produtos.' });
  }
});

router.get('/collection/:collectionName', async (req, res) => {
  const { collectionName } = req.params;
  console.log(`>>> Rota GET /api/products/collection/${collectionName} atingida!`);

  if (!Object.values(COLLECTIONS).includes(collectionName)) {
    console.warn(`Coleção solicitada '${collectionName}' não encontrada ou não permitida.`);
    return res.status(404).json({ message: 'Coleção não encontrada ou não permitida.' });
  }

  try {
    console.log(`Tentando buscar da coleção específica: ${collectionName}`);
    const ProductModel = getProductModelForCollection(collectionName);
    const products = await ProductModel.find({}).lean();
    console.log(`Encontrados ${products.length} produtos na coleção ${collectionName}`);
    products.forEach(p => p.source_collection = collectionName);
    res.json(products);
  } catch (error) {
    console.error(`Erro ao buscar produtos da coleção ${collectionName}:`, error);
    res.status(500).json({ message: `Erro interno do servidor ao buscar produtos da coleção ${collectionName}.` });
  }
});

module.exports = router;
