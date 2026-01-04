# Imagem base leve
FROM node:20-alpine

# Diretório de trabalho
WORKDIR /app

# Copiar dependências primeiro (melhor cache)
COPY package*.json ./

# Instalar dependências
RUN npm install --only=production

# Copiar o restante da aplicação
COPY . .

# Porta exposta
EXPOSE 3000

# Comando de execução
CMD ["node", "index.js"]

