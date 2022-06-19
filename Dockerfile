FROM node:18-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . ./
RUN npm install
COPY --chown=node:node . .
RUN npm run build
EXPOSE 3333
CMD [ "node", "./dist/server.js" ]