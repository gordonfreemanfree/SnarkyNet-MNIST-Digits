# Base image of node 16
FROM node:16

MAINTAINER makalfo "makalfo@chthonia.io"

# Working Directory 
RUN mkdir /SnarkyNet
WORKDIR /SnarkyNet

# Copy and NPM install
COPY . .
RUN npm install 

# Typescript
RUN npx tsc

# Entry point
ENTRYPOINT ["node", "build/index.js"]