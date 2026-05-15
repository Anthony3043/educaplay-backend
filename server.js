require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

// CORS configurado para aceitar qualquer origin (necessário no Render)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Rotas
app.use('/api/auth', require('./src/routes/auth'));
app.use('/api', require('./src/routes/api'));

// Health check
app.get('/', (req, res) => res.json({ status: 'EducaPlay API rodando ✅' }));

// Tratamento de erros global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

const PORT = process.env.PORT || 3000;
// 0.0.0.0 é obrigatório no Render (não pode ser só localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
