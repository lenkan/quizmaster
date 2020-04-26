FROM node:12-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
RUN ls -la
COPY . .

ENTRYPOINT [ "yarn", "start" ]
