FROM node:22-slim

WORKDIR /api

COPY package.json /api
RUN npm i
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /api

COPY . /api

EXPOSE 3000

RUN npx prisma db pull
RUN npx prisma generate

CMD ["npm", "run", "build"]
