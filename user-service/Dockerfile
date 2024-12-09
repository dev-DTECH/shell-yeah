FROM node:20

COPY ./common /common

WORKDIR /common

RUN npm install
RUN npm run build

WORKDIR /app

COPY ./user-service/package.json .
# COPY package-lock.json .
RUN npm install

COPY ./user-service .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]