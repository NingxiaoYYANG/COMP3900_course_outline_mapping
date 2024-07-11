FROM node:18

LABEL maintainer="22587474+psharma04@users.noreply.github.com"

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

USER node

RUN npm install

COPY --chown=node:node public ./public
COPY --chown=node:node src ./src

EXPOSE 3000

CMD ["npm", "start"]