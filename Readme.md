# Article API

Guide to configure the API

## Enviromments variables

First, create an .env file in the root path and then write the following keys.

### Example

```
APP_HOST=0.0.0.0
APP_PORT=4000
APP_URL=http://localhost:4000

MONGO_CONTAINER=article_db
MONGO_USERNAME=
MONGO_PASSWORD=
MONGO_PORT=27017
MONGO_DB=

SESSION_KEY=3f98c7eab26d9e2d775483e40e918455
SESSION_LIFETIME=1d
```

## Docker containers

Now I’m going to teach you how to set up the docker containers, it’s very simple. Create a docker-compose.yaml file and then type the following.


```yaml
version: "3"

services:
  mongo:
    container_name: article_db
    image: mongo
    networks:
      - mongo
    env_file:
      - .env
    environment:
      - MONGO_PORT=$MONGO_PORT
      - MONGO_DB=$MONGO_DB
      - MONGO_INITDB_ROOT_USERNAME=$MONGO_USERNAME
      - MONGO_INITDB_ROOT_PASSWORD=$MONGO_PASSWORD

    restart: always
  app:
    image: node:12.16.1
    container_name: "article_api"
    working_dir: /home/node/app
    volumes:
      - ./:/home/node/app
      - /home/node/app/node_modules
    networks:
      - mongo
    env_file:
      - .env
    ports:
      - $APP_PORT:4000
    depends_on:
      - mongo
    restart: always
    command: bash -c "yarn && yarn start"

networks:
  mongo:
    driver: bridge
```

In root path run

```bash
docker-compose -f "docker-compose.yaml" up -d --build
```

Test in http://localhost:0000 (replace 0000 with your port)
