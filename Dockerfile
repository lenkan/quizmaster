FROM node:14-alpine

ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --production
COPY . .

ENTRYPOINT [ "npm", "start" ]
