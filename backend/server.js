// backend/server.js

require('dotenv').config(); // Carrega variáveis do .env para process.env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const nodemailer = require('nodemailer');

const app = express();

// Middleware Essencial
app.use(cors()); // Habilita CORS para permitir requisições do frontend
app.use(express.json()); // Permite que o servidor entenda JSON no corpo das requisições

// Rota de Teste
app.get('/', (req, res) => {
    res.send('API PROMOFORIA está rodando!');
});

// Monta as Rotas de Produtos
app.use('/api/products', productRoutes); // Todas as rotas em productRoutes serão prefixadas com /api/products

// Configuração do Nodemailer
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
        // Considere não iniciar o servidor se o email não puder ser configurado
        // process.exit(1);
    } else {
        console.log("Servidor SMTP pronto para receber mensagens:", success);
    }
});


// Rota EXISTENTE para Inscrição na Newsletter (mantida, mas não usada pelo footer atual)
app.post('/api/newsletter-subscribe', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'O endereço de e-mail é obrigatório.' });
    }

    const mailOptions = {
        from: `"Promoforia Notificação" <${process.env.SMTP_MAIL}>`,
        to: 'suportwebcash@gmail.com', // Destinatário fixo
        subject: 'Nova Inscrição na Newsletter Promoforia',
        text: `Um novo cliente se inscreveu na newsletter.\n\nEmail do Cliente: ${email}`,
        html: `<p>Um novo cliente se inscreveu na newsletter.</p><p><strong>Email do Cliente:</strong> ${email}</p>`,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail de notificação de newsletter enviado:', info.response);
        res.status(200).json({ message: 'Inscrição na newsletter recebida e notificação enviada!' });
    } catch (error) {
        console.error('Erro ao enviar e-mail de notificação de newsletter:', error);
        res.status(500).json({ message: 'Ocorreu um erro ao processar a sua inscrição na newsletter.' });
    }
});


// ✅ NOVA Rota para Receber Comentários ✅
app.post('/api/submit-comment', async (req, res) => {
    const { name, email, comment } = req.body; // Pega os dados do corpo da requisição

    // Validação básica
    if (!name || !email || !comment) {
        return res.status(400).json({ message: 'Nome, e-mail e comentário são obrigatórios.' });
    }

    // Configuração do e-mail a ser enviado
    const mailOptions = {
        from: `"Promoforia Contato" <${process.env.SMTP_MAIL}>`, // Remetente
        to: 'suportwebcash@gmail.com', // ✅ Destinatário fixo para receber os comentários ✅
        subject: 'Novo Comentário Recebido no Site Promoforia', // Assunto
        text: `Você recebeu um novo comentário no site Promoforia.\n\nNome: ${name}\nEmail: ${email}\nComentário:\n---\n${comment}\n---`, // Corpo em texto plano
        html: `
            <p>Você recebeu um novo comentário no site Promoforia.</p>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Comentário:</strong></p>
            <p>${comment.replace(/\n/g, '<br>')}</p>         `, // Corpo em HTML
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('E-mail de comentário enviado:', info.response);
        // Responde ao front-end com sucesso
        res.status(200).json({ message: 'Comentário enviado com sucesso! Obrigado pela sua opinião.' });
    } catch (error) {
        console.error('Erro ao enviar e-mail de comentário:', error);
        // Responde ao front-end com erro. Em produção, logar o erro no servidor é suficiente,
        // evite enviar detalhes do erro ao front-end por segurança.
        res.status(500).json({ message: 'Ocorreu um erro ao processar seu comentário. Por favor, tente novamente mais tarde.' });
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