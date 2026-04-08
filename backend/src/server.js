require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const { prisma } = require('./config/database');
const logger = require('./config/logger');

// Importação das rotas
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging de requisições
app.use((req, res, next) => {
    logger.debug(`${req.method} ${req.path}`);
    next();
});

// Rotas - CORRIGIDO: garantir que são funções middleware
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/reports', reportRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    });
});

// Rota raiz
app.get('/', (req, res) => {
    res.json({
        name: 'API de Controle Financeiro Pessoal',
        version: '1.0.0',
        status: 'online',
        endpoints: {
            auth: '/api/auth',
            transactions: '/api/transactions',
            reports: '/api/reports',
            health: '/health'
        }
    });
});

// Tratamento de erro 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.url} não existe`,
        timestamp: new Date().toISOString()
    });
});

// Middleware de erro global
app.use((err, req, res, next) => {
    logger.error('Erro capturado:', err);

    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(status).json({
        error: 'Erro no processamento',
        message: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Iniciar servidor
async function startServer() {
    try {
        await prisma.$connect();
        logger.info('✅ Conectado ao banco de dados');

        app.listen(PORT, () => {
            logger.info(`
      ========================================
      🚀 API de Controle Financeiro
      📡 URL: http://localhost:${PORT}
      🌍 Ambiente: ${process.env.NODE_ENV}
      📅 Iniciado em: ${new Date().toISOString()}
      ========================================
      `);
        });
    } catch (error) {
        logger.error('❌ Erro ao iniciar servidor:', error);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    logger.info('\n🛑 Recebido SIGINT. Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    logger.info('\n🛑 Recebido SIGTERM. Encerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

startServer();

module.exports = app;