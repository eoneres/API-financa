const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // Limpar dados existentes
    await prisma.transaction.deleteMany();
    await prisma.user.deleteMany();

    // Criar usuário demo
    const hashedPassword = await bcrypt.hash('demo123456', 10);
    const apiKey = 'demo-api-key-' + Date.now();

    const user = await prisma.user.create({
        data: {
            email: 'demo@financeiro.com',
            password: hashedPassword,
            apiKey: apiKey,
            name: 'Usuário Demo',
            transactions: {
                create: [
                    {
                        description: 'Salário',
                        amount: 5000.00,
                        type: 'INCOME',
                        category: 'OTHER',
                        date: new Date('2024-01-10')
                    },
                    {
                        description: 'Supermercado',
                        amount: 450.00,
                        type: 'EXPENSE',
                        category: 'FOOD',
                        date: new Date('2024-01-05')
                    },
                    {
                        description: 'Uber',
                        amount: 35.50,
                        type: 'EXPENSE',
                        category: 'TRANSPORT',
                        date: new Date('2024-01-07')
                    },
                    {
                        description: 'Cinema',
                        amount: 45.00,
                        type: 'EXPENSE',
                        category: 'LEISURE',
                        date: new Date('2024-01-12')
                    },
                    {
                        description: 'Conta de Luz',
                        amount: 120.00,
                        type: 'EXPENSE',
                        category: 'BILLS',
                        date: new Date('2024-01-15')
                    },
                    {
                        description: 'Netflix',
                        amount: 39.90,
                        type: 'EXPENSE',
                        category: 'LEISURE',
                        date: new Date('2024-01-20')
                    },
                    {
                        description: 'Farmácia',
                        amount: 89.50,
                        type: 'EXPENSE',
                        category: 'HEALTH',
                        date: new Date('2024-01-18')
                    },
                    {
                        description: 'Curso Online',
                        amount: 199.90,
                        type: 'EXPENSE',
                        category: 'EDUCATION',
                        date: new Date('2024-01-25')
                    }
                ]
            }
        }
    });

    console.log('✅ Seed concluído!');
    console.log('========================================');
    console.log('📧 Email: demo@financeiro.com');
    console.log('🔑 Senha: demo123456');
    console.log(`🔐 API Key: ${apiKey}`);
    console.log('========================================');
}

main()
    .catch(e => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });