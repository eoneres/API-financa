const { prisma } = require('../config/database');
const { groupByCategory, groupByPeriod } = require('../utils/helpers');
const logger = require('../config/logger');

class ReportService {
    async getExpensesByCategory(userId, startDate, endDate) {
        const where = {
            userId,
            type: 'EXPENSE'
        };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const transactions = await prisma.transaction.findMany({
            where,
            select: {
                category: true,
                amount: true
            }
        });

        const grouped = groupByCategory(transactions);
        const totalExpenses = grouped.reduce((sum, item) => sum + item.total, 0);

        const categoriesWithPercentage = grouped.map(item => ({
            ...item,
            percentage: totalExpenses > 0 ? (item.total / totalExpenses) * 100 : 0
        }));

        return {
            total_expenses: totalExpenses,
            categories: categoriesWithPercentage.sort((a, b) => b.total - a.total)
        };
    }

    async getMonthlySummary(userId, year, month) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: startDate,
                    lte: endDate
                }
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
            year,
            month,
            total_income: totalIncome,
            total_expense: totalExpense,
            balance: totalIncome - totalExpense,
            transaction_count: transactions.length,
            start_date: startDate,
            end_date: endDate
        };
    }

    async getPeriodAnalysis(userId, startDate, endDate, groupBy = 'day') {
        const where = { userId };

        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const transactions = await prisma.transaction.findMany({
            where,
            orderBy: { date: 'asc' }
        });

        const grouped = groupByPeriod(transactions, groupBy);

        return {
            period: groupBy,
            start_date: startDate || transactions[0]?.date,
            end_date: endDate || transactions[transactions.length - 1]?.date,
            data: grouped
        };
    }

    async getFinancialHealth(userId) {
        // Últimos 6 meses
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const transactions = await prisma.transaction.findMany({
            where: {
                userId,
                date: {
                    gte: sixMonthsAgo
                }
            }
        });

        let totalIncome = 0;
        let totalExpense = 0;
        const monthlyData = {};

        transactions.forEach(transaction => {
            const monthKey = `${transaction.date.getFullYear()}-${transaction.date.getMonth() + 1}`;

            if (!monthlyData[monthKey]) {
                monthlyData[monthKey] = { income: 0, expense: 0 };
            }

            if (transaction.type === 'INCOME') {
                totalIncome += transaction.amount;
                monthlyData[monthKey].income += transaction.amount;
            } else {
                totalExpense += transaction.amount;
                monthlyData[monthKey].expense += transaction.amount;
            }
        });

        const monthsWithData = Object.keys(monthlyData).length;
        const averageIncome = monthsWithData > 0 ? totalIncome / monthsWithData : 0;
        const averageExpense = monthsWithData > 0 ? totalExpense / monthsWithData : 0;

        // Calcular economia média
        const averageSavings = averageIncome - averageExpense;
        const savingsRate = averageIncome > 0 ? (averageSavings / averageIncome) * 100 : 0;

        // Determinar saúde financeira
        let healthStatus = 'critical';
        if (savingsRate >= 20) healthStatus = 'excellent';
        else if (savingsRate >= 10) healthStatus = 'good';
        else if (savingsRate >= 0) healthStatus = 'warning';

        return {
            health_status: healthStatus,
            savings_rate: savingsRate.toFixed(2),
            average_monthly_income: averageIncome,
            average_monthly_expense: averageExpense,
            average_monthly_savings: averageSavings,
            total_income_6m: totalIncome,
            total_expense_6m: totalExpense,
            months_analyzed: monthsWithData,
            monthly_breakdown: monthlyData
        };
    }
}

module.exports = new ReportService();