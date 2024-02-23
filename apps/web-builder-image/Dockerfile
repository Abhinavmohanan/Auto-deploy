FROM node:21-alpine

WORKDIR /app

RUN apk update
RUN apk add git
RUN apk add curl
RUN apk add bash

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN chmod +x main.sh
RUN chmod +x script.js

ENTRYPOINT [ "./main.sh" ]

