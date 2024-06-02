FROM node:22-alpine

WORKDIR /api

COPY package.json /api
RUN npm i

WORKDIR /api

COPY . /api

EXPOSE 3000

RUN npx prisma db pull
RUN npx prisma generate

CMD ["npm", "run", "build"]