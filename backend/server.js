// backend/server.js
require('dotenv').config(); // Carrega variáveis do .env para process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware Essencial
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API WebCash está rodando!');
});

// Monta as Rotas de Produtos
app.use('/api/products', productRoutes); // Todas as rotas em productRoutes serão prefixadas com /api/products

// Conexão com MongoDB Atlas
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.error('Erro: MONGO_URI não definido no arquivo .env');
    process.exit(1); // Sai se a URI do banco não estiver configurada
}

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB conectado com sucesso!');
        // Inicia o servidor APÓS conectar ao banco
        app.listen(PORT, () => {
            console.log(`Servidor rodando na porta ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('Erro ao conectar ao MongoDB:', err);
        process.exit(1);
    });