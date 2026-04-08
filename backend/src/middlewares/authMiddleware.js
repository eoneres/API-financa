const jwt = require('jsonwebtoken');
const authService = require('../services/authService');
const logger = require('../config/logger');

async function authenticateJWT(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error: 'Token não fornecido',
            message: 'É necessário fornecer um token Bearer válido'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userEmail = decoded.email;
        next();
    } catch (error) {
        logger.error('Erro na autenticação JWT:', error);

        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: 'Token inválido' });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado' });
        }

        return res.status(401).json({ error: 'Erro na autenticação' });
    }
}

async function authenticateApiKey(req, res, next) {
    const apiKey = req.headers[process.env.API_KEY_HEADER || 'x-api-key'];

    if (!apiKey) {
        return res.status(401).json({
            error: 'API Key não fornecida',
            message: 'É necessário fornecer uma API Key válida'
        });
    }

    try {
        const user = await authService.validateApiKey(apiKey);

        if (!user) {
            return res.status(401).json({ error: 'API Key inválida' });
        }

        req.userId = user.id;
        req.userEmail = user.email;
        next();
    } catch (error) {
        logger.error('Erro na autenticação por API Key:', error);
        return res.status(500).json({ error: 'Erro interno na autenticação' });
    }
}

function authenticate(req, res, next) {
    // Tenta primeiro JWT, depois API Key
    const authHeader = req.headers.authorization;
    const apiKey = req.headers[process.env.API_KEY_HEADER || 'x-api-key'];

    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authenticateJWT(req, res, next);
    } else if (apiKey) {
        return authenticateApiKey(req, res, next);
    } else {
        return res.status(401).json({
            error: 'Não autenticado',
            message: 'Forneça um token Bearer ou API Key'
        });
    }
}

module.exports = { authenticate, authenticateJWT, authenticateApiKey };