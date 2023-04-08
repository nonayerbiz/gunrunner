# FROM node:latest
FROM arm64v8/node:latest
WORKDIR /usr/src/app
COPY package.json ./package.json
RUN npm install
EXPOSE 9090
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]



