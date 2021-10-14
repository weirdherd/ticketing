FROM node:current-alpine3.14

WORKDIR /app
COPY package.json .
COPY package-lock.json .

RUN npm config set timeout 120000

RUN npm install --production

COPY . .

CMD ["npm", "start"]
