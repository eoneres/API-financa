const { prisma } = require('../config/database');
const logger = require('../config/logger');

const reportController = {
    async getExpensesByCategory(req, res, next) {
        try {
            let { startDate, endDate } = req.query;

            const where = { type: 'EXPENSE' };

            if (startDate && startDate !== 'undefined') {
                where.date = { ...where.date, gte: new Date(startDate) };
            }
            if (endDate && endDate !== 'undefined') {
                where.date = { ...where.date, lte: new Date(endDate) };
            }

            const transactions = await prisma.transaction.findMany({
                where,
                select: { category: true, amount: true }
            });

            const grouped = {};
            let totalExpenses = 0;

            transactions.forEach(transaction => {
                const category = transaction.category;
                if (!grouped[category]) {
                    grouped[category] = { category, total: 0, count: 0 };
                }
                grouped[category].total += transaction.amount;
                grouped[category].count += 1;
                totalExpenses += transaction.amount;
            });

            const categories = Object.values(grouped).map(item => ({
                ...item,
                percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
            }));

            res.json({
                success: true,
                data: {
                    total_expenses: totalExpenses,
                    categories: categories.sort((a, b) => b.total - a.total)
                }
            });
        } catch (error) {
            logger.error('Erro ao gerar relatório:', error);
            next(error);
        }
    },

    async getMonthlySummary(req, res, next) {
        try {
            const { year, month } = req.query;

            if (!year || !month) {
                return res.status(400).json({
                    success: false,
                    error: 'Ano e mês são obrigatórios'
                });
            }

            const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
            const endDate = new Date(parseInt(year), parseInt(month), 0);

            const transactions = await prisma.transaction.findMany({
                where: {
                    date: { gte: startDate, lte: endDate }
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

            res.json({
                success: true,
                data: {
                    year: parseInt(year),
                    month: parseInt(month),
                    total_income: totalIncome,
                    total_expense: totalExpense,
                    balance: totalIncome - totalExpense,
                    transaction_count: transactions.length
                }
            });
        } catch (error) {
            logger.error('Erro no resumo mensal:', error);
            next(error);
        }
    },

    async getPeriodAnalysis(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    period: 'day',
                    data: []
                }
            });
        } catch (error) {
            logger.error('Erro na análise periódica:', error);
            next(error);
        }
    },

    async getFinancialHealth(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    health_status: 'good',
                    savings_rate: 15.5,
                    average_monthly_income: 5000,
                    average_monthly_expense: 4225,
                    average_monthly_savings: 775
                }
            });
        } catch (error) {
            logger.error('Erro na saúde financeira:', error);
            next(error);
        }
    }
};

module.exports = reportController;