FROM node:20

WORKDIR /app

COPY ./web-ui-service/package.json .
RUN npm install

COPY ./web-ui-service .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]