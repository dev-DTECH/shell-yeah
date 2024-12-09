FROM node:20

COPY ./common /common

WORKDIR /common

RUN npm install

RUN ls -la /common && sleep 10

WORKDIR /app

COPY ./shell-yeah-web/package.json .
RUN npm install

COPY ./shell-yeah-web .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]