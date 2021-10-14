FROM node:current-alpine

WORKDIR /app
COPY package.json .

RUN npm config set timeout 120000

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
