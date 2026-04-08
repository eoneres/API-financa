FROM node:18-alpine

# Instalar OpenSSL e ferramentas necessárias
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat \
    ca-certificates

WORKDIR /app

# Copiar package files
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm ci --only=production || npm install

# Gerar Prisma Client
RUN npx prisma generate

# Copiar código fonte
COPY . .

EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {r.statusCode === 200 ? process.exit(0) : process.exit(1)})"

# Iniciar aplicação
CMD ["sh", "-c", "npx prisma migrate deploy && node src/server.js"]