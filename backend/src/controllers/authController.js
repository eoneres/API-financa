const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { prisma } = require('../config/database');
const logger = require('../config/logger');

function generateApiKey() {
  return require('crypto').randomBytes(32).toString('hex');
}

const authController = {
  async register(req, res, next) {
    try {
      const { email, password, name } = req.body;

      // Verificar se usuário já existe
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'Email já cadastrado'
        });
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
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`Novo usuário registrado: ${email}`);

      res.status(201).json({
        success: true,
        message: 'Usuário criado com sucesso',
        data: { user, token }
      });
    } catch (error) {
      logger.error('Erro no registro:', error);
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha inválidos'
        });
      }

      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Email ou senha inválidos'
        });
      }

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      logger.info(`Usuário logado: ${email}`);

      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            apiKey: user.apiKey
          },
          token
        }
      });
    } catch (error) {
      logger.error('Erro no login:', error);
      next(error);
    }
  },

  async getProfile(req, res, next) {
    try {
      // Por enquanto, retorna um mock (depois implementamos autenticação)
      res.json({
        success: true,
        data: {
          user: {
            id: '1',
            email: 'demo@financeiro.com',
            name: 'Usuário Demo'
          }
        }
      });
    } catch (error) {
      logger.error('Erro ao buscar perfil:', error);
      next(error);
    }
  }
};

module.exports = authController;