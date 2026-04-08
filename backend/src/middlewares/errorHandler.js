const logger = require('../config/logger');

function errorHandler(err, req, res, next) {
    logger.error('Erro capturado pelo middleware:', err);

    // Erro de validação do Prisma
    if (err.code === 'P2002') {
        return res.status(409).json({
            error: 'Conflito',
            message: 'Registro já existe no sistema',
            field: err.meta?.target
        });
    }

    if (err.code === 'P2025') {
        return res.status(404).json({
            error: 'Não encontrado',
            message: 'Registro não encontrado'
        });
    }

    // Erro de negócio (lançado pelos services)
    if (err.message === 'Email já cadastrado' ||
        err.message === 'Email ou senha inválidos' ||
        err.message === 'Transação não encontrada') {
        return res.status(400).json({
            error: 'Erro de negócio',
            message: err.message
        });
    }

    // Erro padrão
    const status = err.status || 500;
    const message = err.message || 'Erro interno do servidor';

    res.status(status).json({
        error: 'Erro no processamento',
        message: message,
        timestamp: new Date().toISOString(),
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
}

function notFoundHandler(req, res) {
    res.status(404).json({
        error: 'Rota não encontrada',
        message: `A rota ${req.method} ${req.url} não existe`,
        timestamp: new Date().toISOString()
    });
}

module.exports = { errorHandler, notFoundHandler };