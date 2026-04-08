const { prisma } = require('../config/database');
const logger = require('../config/logger');

class TransactionService {
    async createTransaction(userId, transactionData) {
        const { description, amount, type, category, date } = transactionData;

        const transaction = await prisma.transaction.create({
            data: {
                description,
                amount,
                type,
                category,
                date: date ? new Date(date) : new Date(),
                userId
            }
        });

        logger.info(`Transação criada: ${description} - ${amount} para usuário ${userId}`);
        return transaction;
    }

    async getTransactions(userId, filters = {}) {
        const { startDate, endDate, type, category, limit = 100, offset = 0 } = filters;

        const where = { userId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        if (type) where.type = type;
        if (category) where.category = category;

        const [transactions, total] = await Promise.all([
            prisma.transaction.findMany({
                where,
                orderBy: { date: 'desc' },
                take: parseInt(limit),
                skip: parseInt(offset)
            }),
            prisma.transaction.count({ where })
        ]);

        return {
            data: transactions,
            pagination: {
                total,
                limit: parseInt(limit),
                offset: parseInt(offset),
                pages: Math.ceil(total / parseInt(limit))
            }
        };
    }

    async getTransactionById(userId, transactionId) {
        const transaction = await prisma.transaction.findFirst({
            where: {
                id: transactionId,
                userId
            }
        });

        if (!transaction) {
            throw new Error('Transação não encontrada');
        }

        return transaction;
    }

    async updateTransaction(userId, transactionId, updateData) {
        // Verificar se transação existe e pertence ao usuário
        await this.getTransactionById(userId, transactionId);

        const transaction = await prisma.transaction.update({
            where: { id: transactionId },
            data: {
                ...updateData,
                date: updateData.date ? new Date(updateData.date) : undefined
            }
        });

        logger.info(`Transação atualizada: ${transactionId} para usuário ${userId}`);
        return transaction;
    }

    async deleteTransaction(userId, transactionId) {
        // Verificar se transação existe e pertence ao usuário
        await this.getTransactionById(userId, transactionId);

        await prisma.transaction.delete({
            where: { id: transactionId }
        });

        logger.info(`Transação deletada: ${transactionId} para usuário ${userId}`);
        return { message: 'Transação deletada com sucesso' };
    }

    async getBalance(userId, startDate, endDate) {
        const where = { userId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const transactions = await prisma.transaction.findMany({
            where,
            select: {
                type: true,
                amount: true
            }
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

        return {
            total_income: totalIncome,
            total_expense: totalExpense,
            balance: totalIncome - totalExpense,
            transaction_count: transactions.length
        };
    }
}

module.exports = new TransactionService();