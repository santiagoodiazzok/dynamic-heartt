FROM node:20-slim

WORKDIR /app

# Instala dependencias
COPY package*.json ./
RUN npm install

# Copia todo el proyecto
COPY . .

# Compila cliente + servidor
RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]