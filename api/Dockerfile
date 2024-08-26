FROM node:16
COPY /init/tools/dockermodule/dockerize-linux-amd64-v0.6.1.tar.gz /
RUN tar -C /usr/local/bin -xzvf dockerize-linux-amd64-v0.6.1.tar.gz

WORKDIR /app
COPY package.json ./
COPY ./ ./
EXPOSE 3000
RUN npm i
RUN chmod +x docker-entrypoint.sh
ENTRYPOINT ./docker-entrypoint.sh
