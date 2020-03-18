# Article API

Guide to configure the API

## Enviromments variables

First, create an .env file in the root path and then write the following keys.

### Example

```
APP_PORT=80

DB_PORT=27017
DB_NAME=dbname

SESSION_KEY=sessionkey
SESSION_LIFETIME=7d
```

## Docker containers

Now I’m going to teach you how to set up the docker containers, it’s very simple. Create a docker-compose.yaml file and then type the following.


```yaml
version: "3"

services:
  mongo:
    container_name: article_db
    image: mongo
    ports:
      - "27017:${DB_PORT}"
    networks:
      - mongo
    env_file:
      - .env
    restart: always
  app:
    container_name: "article_api"
    build: .
    command: npm start
    ports:
      - "4000:${APP_PORT}"
    volumes:
      - .:/usr/app
    networks:
      - mongo
    env_file:
      - .env
    restart: always

networks:
  mongo:
    driver: bridge
```

Create an Dockerfile, no need extension

```dockerfile
FROM node:12.16.1

WORKDIR /usr/app

COPY package.json yarn.lock
RUN yarn

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]
```

In root path run

```bash
docker-compose -f "docker-compose.yaml" up -d --build
```

Test in http://localhost:0000 (replace 0000 with your port)
