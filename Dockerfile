ARG NODE_ENV=production
FROM node:12-alpine

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

CMD ["node", "handler.js"]