# syntax=docker/dockerfile:1

FROM node:12-alpine
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

RUN [ "npm", "i", "-g", "pm2" ]

CMD [ "npm", "start" ]
