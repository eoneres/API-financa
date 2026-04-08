const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const { generateApiKey } = require('../utils/helpers');
const logger = require('../config/logger');

class AuthService {
    async register(userData) {
        const { email, password, name } = userData;

        // Verificar se usuário já existe
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Email já cadastrado');
        }

        // Hash da senha
        const hashedPassword = await bcrypt.hash(password, 10);
        const apiKey = generateApiKey();

        // Criar usuário
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                apiKey,
                name: name || null
            },
            select: {
                id: true,
                email: true,
                name: true,
                apiKey: true,
                createdAt: true
            }
        });

        // Gerar token JWT
        const token = this.generateToken(user.id, user.email);

        logger.info(`Novo usuário registrado: ${email}`);

        return {
            user,
            token
        };
    }

    async login(email, password) {
        // Buscar usuário
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Email ou senha inválidos');
        }

        // Verificar senha
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Email ou senha inválidos');
        }

        // Gerar token
        const token = this.generateToken(user.id, user.email);

        logger.info(`Usuário logado: ${email}`);

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                apiKey: user.apiKey
            },
            token
        };
    }

    generateToken(userId, email) {
        return jwt.sign(
            { userId, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );
    }

    async validateApiKey(apiKey) {
        const user = await prisma.user.findUnique({
            where: { apiKey }
        });

        return user;
    }

    async getUserById(userId) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                apiKey: true,
                createdAt: true
            }
        });

        if (!user) {
            throw new Error('Usuário não encontrado');
        }

        return user;
    }
}

module.exports = new AuthService();