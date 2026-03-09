FROM node:20-slim

WORKDIR /app

COPY package*.json ./
RUN npm install

# Fuerza invalidar cache con la fecha del build
ARG GIT_SHA
RUN echo "Build: $GIT_SHA"

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
