FROM node:20

COPY ./common /common

WORKDIR /common

RUN npm install
RUN npm run build

WORKDIR /app

COPY ./web-ui-service/package.json .
RUN npm install

COPY ./web-ui-service .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]