const request = require('supertest');
const app = require('../src/server');
const { prisma } = require('../src/config/database');

describe('Auth Endpoints', () => {
    beforeAll(async () => {
        await prisma.$connect();
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    beforeEach(async () => {
        await prisma.transaction.deleteMany();
        await prisma.user.deleteMany();
    });

    describe('POST /api/auth/register', () => {
        it('deve registrar um novo usuário', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'teste@example.com',
                    password: '123456',
                    name: 'Usuário Teste'
                });

            expect(response.status).toBe(201);
            expect(response.body.success).toBe(true);
            expect(response.body.data.user.email).toBe('teste@example.com');
            expect(response.body.data.token).toBeDefined();
        });

        it('não deve registrar com email duplicado', async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicado@example.com',
                    password: '123456'
                });

            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'duplicado@example.com',
                    password: '123456'
                });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe('Erro de negócio');
        });
    });

    describe('POST /api/auth/login', () => {
        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    email: 'login@example.com',
                    password: 'senha123'
                });
        });

        it('deve fazer login com credenciais corretas', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'senha123'
                });

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.token).toBeDefined();
        });

        it('não deve fazer login com senha incorreta', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: 'login@example.com',
                    password: 'senhaerrada'
                });

            expect(response.status).toBe(400);
            expect(response.body.message).toBe('Email ou senha inválidos');
        });
    });
});