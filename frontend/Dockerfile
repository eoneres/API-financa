FROM node:18-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar código fonte
COPY . .

EXPOSE 3000

# Iniciar em modo desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]