FROM node:16-alpine

USER node

RUN mkdir /home/node/.npm-global ; \
    mkdir -p /home/node/app ; \
    chown -R node:node /home/node/app ; \
    chown -R node:node /home/node/.npm-global

ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

WORKDIR /home/node

COPY package.json package.json
RUN npm install --quiet

COPY . .

USER $USER

RUN npm run build

ARG NODE
ENV NODE_ENV ${NODE}
ARG PORT

EXPOSE $PORT

ENTRYPOINT [ "node", "dist/app.js" ]