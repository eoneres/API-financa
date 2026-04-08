# 💰 FinanceControl - API de Controle Financeiro Pessoal

Sistema completo de controle financeiro com backend em Node.js, frontend em React e containerização Docker.

## 🚀 Tecnologias

- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + Vite + TailwindCSS + Recharts
- **Docker** + **Docker Compose**
- **Autenticação**: JWT

## 📦 Pré-requisitos

- Docker e Docker Compose
- Node.js 18+ (para desenvolvimento local)
- Git

## 🏃 Como Executar

### Usando Docker (Recomendado)

```bash
# Clonar o repositório
git clone https://github.com/eoneres/api-financa.git
cd api-financa

# Subir os containers
docker-compose up -d --build

# Aguardar inicialização (20 segundos)

# Acessar a aplicação
# Frontend: http://localhost:8080
# Backend API: http://localhost:8081

Credenciais de Acesso
Email: demo@financeiro.com

Senha: demo123456

Desenvolvimento Local

# Backend
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run dev

# Frontend (em outro terminal)
cd frontend
npm install
npm run dev

📚 Documentação da API
Autenticação

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@financeiro.com","password":"demo123456"}'

# Registro
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"usuario@email.com","password":"123456","name":"Usuario"}'

Transações

# Listar transações
curl -X GET http://localhost:8081/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN"

# Criar transação
curl -X POST http://localhost:8081/api/transactions \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"description":"Supermercado","amount":150.50,"type":"EXPENSE","category":"FOOD"}'

🐛 Comandos Úteis

# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Parar e remover volumes (reset completo)
docker-compose down -v

# Reconstruir containers
docker-compose build --no-cache

# Acessar container do backend
docker exec -it finance-backend sh

# Acessar banco de dados
docker exec -it finance-postgres psql -U fin_user -d fin_db

📁 Estrutura do Projeto

api-financa/
├── backend/          # API Node.js + Prisma
├── frontend/         # React + Vite + Tailwind
├── docker-compose.yml
└── README.md

👨‍💻 Autor
Desenvolvido como projeto de portfólio para aprimorar habilidades de Java (Spring Boot) + PostgreSQL + Docker + Autenticação básica (API Key ou JWT) + Documentação com Swagger

Filipe Neres Fernandes

📄 Licença
MIT