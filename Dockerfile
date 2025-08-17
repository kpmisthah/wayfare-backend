FROM node:24-alpine

WORKDIR /app

COPY prisma ./prisma

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

CMD [ "npm", "run", "start:dev" ]