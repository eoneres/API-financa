const crypto = require('crypto');

function generateApiKey() {
    return crypto.randomBytes(32).toString('hex');
}

function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date));
}

function calculatePercentage(part, total) {
    if (total === 0) return 0;
    return (part / total) * 100;
}

function groupByCategory(transactions) {
    const grouped = {};

    transactions.forEach(transaction => {
        const category = transaction.category;
        if (!grouped[category]) {
            grouped[category] = {
                category,
                total: 0,
                count: 0
            };
        }
        grouped[category].total += transaction.amount;
        grouped[category].count += 1;
    });

    return Object.values(grouped);
}

function groupByPeriod(transactions, period = 'day') {
    const grouped = {};

    transactions.forEach(transaction => {
        let key;
        const date = new Date(transaction.date);

        if (period === 'day') {
            key = date.toISOString().split('T')[0];
        } else if (period === 'month') {
            key = `${date.getFullYear()}-${date.getMonth() + 1}`;
        } else if (period === 'year') {
            key = `${date.getFullYear()}`;
        }

        if (!grouped[key]) {
            grouped[key] = {
                period: key,
                total: 0,
                income: 0,
                expense: 0,
                count: 0
            };
        }

        grouped[key].total += transaction.type === 'INCOME' ? transaction.amount : -transaction.amount;
        if (transaction.type === 'INCOME') {
            grouped[key].income += transaction.amount;
        } else {
            grouped[key].expense += transaction.amount;
        }
        grouped[key].count += 1;
    });

    return Object.values(grouped).sort((a, b) => a.period.localeCompare(b.period));
}

module.exports = {
    generateApiKey,
    formatCurrency,
    formatDate,
    calculatePercentage,
    groupByCategory,
    groupByPeriod
};