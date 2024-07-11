FROM node:18 as build

LABEL maintainer="22587474+psharma04@users.noreply.github.com"

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY public ./public
COPY src ./src

FROM gcr.io/distroless/nodejs:18

COPY --from=build /app /

EXPOSE 3000

CMD ["npm", "start"]