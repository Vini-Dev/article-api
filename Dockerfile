FROM node:12.16.1

WORKDIR /usr/app

COPY package.json yarn.lock
RUN yarn

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
