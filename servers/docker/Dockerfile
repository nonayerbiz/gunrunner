# base image
FROM node:lts-alpine

# this turns on debugging in the relay
ENV DEBUG=true

# Create app directory
WORKDIR /app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install

RUN npm ci
# If you are building your code for production
# RUN npm ci --only=production

COPY server.js ./

WORKDIR /app/data

EXPOSE 8765
CMD [ "node", "/app/server.js" ]