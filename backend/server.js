// backend/server.js

require('dotenv').config(); // Carrega variáveis do .env para process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const nodemailer = require('nodemailer'); // ✅ Importe nodemailer ✅

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

// ✅ Configuração do Nodemailer ✅
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT == 465, // true para porta 465, false para outras (como 587 TLS)
    auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD, // Use a SENHA DE APP do Google para sua conta Gmail
    },
    // Configurações adicionais se necessário (ex: tls, connectionTimeout)
});

// Verifica a conexão do transporter (opcional, mas útil para depuração)
transporter.verify(function (error, success) {
    if (error) {
        console.error("Erro ao verificar configuração do Nodemailer:", error);
    } else {
        console.log("Servidor SMTP pronto para receber mensagens:", success);
    }
});


// ✅ Nova Rota para Inscrição na Newsletter ✅
app.post('/api/newsletter-subscribe', async (req, res) => {
    const { email } = req.body; // Pega o email enviado pelo front-end no corpo da requisição

    // Validação básica
    if (!email) {
        return res.status(400).json({ message: 'O endereço de e-mail é obrigatório.' });
    }

    // ✅ Enviar E-mail de Notificação ✅
    const mailOptions = {
        from: `"Notificação WebCash" <${process.env.SMTP_MAIL}>`, // Remetente
        to: 'suportwebcash@gmail.com', // Destinatário fixo para a notificação
        subject: 'Nova Inscrição na Promoforia', // Assunto
        text: `Um novo cliente quer receber notificações das ofertas.\n\nEmail do Cliente: ${email}`, // Corpo em texto plano
        html: `<p>Um novo cliente quer receber notificações das ofertas.</p><p><strong>Email do Cliente:</strong> ${email}</p>`, // Corpo em HTML
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail de notificação enviado:', info.response);
        // Responde ao front-end com sucesso
        res.status(200).json({ message: 'Inscrição recebida e notificação enviada com sucesso!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail de notificação:', error);
        // Responde ao front-end com erro
        // Em um ambiente profissional, logar o erro no servidor é crucial. Evite enviar detalhes do erro para o front-end por segurança.
        res.status(500).json({ message: 'Ocorreu um erro ao processar a sua inscrição.' });
    }
});


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