const { prisma } = require('../config/database');
const logger = require('../config/logger');

const transactionController = {
    async create(req, res, next) {
        try {
            const { description, amount, type, category, date } = req.body;

            const userId = '1';

            const transaction = await prisma.transaction.create({
                data: {
                    description,
                    amount: parseFloat(amount),
                    type,
                    category,
                    date: date ? new Date(date) : new Date(),
                    userId
                }
            });

            logger.info(`Transação criada: ${description}`);

            res.status(201).json({
                success: true,
                message: 'Transação criada com sucesso',
                data: transaction
            });
        } catch (error) {
            logger.error('Erro ao criar transação:', error);
            next(error);
        }
    },

    async list(req, res, next) {
        try {
            const { limit = 100, offset = 0 } = req.query;

            const userId = '1';

            const transactions = await prisma.transaction.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: parseInt(limit),
                skip: parseInt(offset)
            });

            res.json({
                success: true,
                data: {
                    data: transactions,
                    pagination: {
                        total: transactions.length,
                        limit: parseInt(limit),
                        offset: parseInt(offset)
                    }
                }
            });
        } catch (error) {
            logger.error('Erro ao listar transações:', error);
            next(error);
        }
    },

    async getById(req, res, next) {
        try {
            const { id } = req.params;

            const transaction = await prisma.transaction.findUnique({
                where: { id }
            });

            if (!transaction) {
                return res.status(404).json({
                    success: false,
                    error: 'Transação não encontrada'
                });
            }

            res.json({
                success: true,
                data: transaction
            });
        } catch (error) {
            logger.error('Erro ao buscar transação:', error);
            next(error);
        }
    },

    async update(req, res, next) {
        try {
            const { id } = req.params;
            const { description, amount, type, category, date } = req.body;

            const transaction = await prisma.transaction.update({
                where: { id },
                data: {
                    description,
                    amount: amount ? parseFloat(amount) : undefined,
                    type,
                    category,
                    date: date ? new Date(date) : undefined
                }
            });

            res.json({
                success: true,
                message: 'Transação atualizada com sucesso',
                data: transaction
            });
        } catch (error) {
            logger.error('Erro ao atualizar transação:', error);
            next(error);
        }
    },

    async delete(req, res, next) {
        try {
            const { id } = req.params;

            await prisma.transaction.delete({
                where: { id }
            });

            res.json({
                success: true,
                message: 'Transação deletada com sucesso'
            });
        } catch (error) {
            logger.error('Erro ao deletar transação:', error);
            next(error);
        }
    },

    async getBalance(req, res, next) {
        try {
            let { startDate, endDate } = req.query;

            const userId = '1';

            const where = { userId };

            if (startDate && startDate !== 'undefined') {
                where.date = { ...where.date, gte: new Date(startDate) };
            }
            if (endDate && endDate !== 'undefined') {
                where.date = { ...where.date, lte: new Date(endDate) };
            }

            const transactions = await prisma.transaction.findMany({
                where,
                select: { type: true, amount: true }
            });

            let totalIncome = 0;
            let totalExpense = 0;

            transactions.forEach(transaction => {
                if (transaction.type === 'INCOME') {
                    totalIncome += transaction.amount;
                } else {
                    totalExpense += transaction.amount;
                }
            });

            res.json({
                success: true,
                data: {
                    total_income: totalIncome,
                    total_expense: totalExpense,
                    balance: totalIncome - totalExpense,
                    transaction_count: transactions.length
                }
            });
        } catch (error) {
            logger.error('Erro ao buscar saldo:', error);
            next(error);
        }
    }
};

module.exports = transactionController;