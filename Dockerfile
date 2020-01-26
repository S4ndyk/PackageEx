FROM node:alpine

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY . .

RUN npm i\
 && npm run build\
 && npm i -g serve

CMD serve -s build