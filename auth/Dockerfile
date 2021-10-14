FROM node:current-alpine3.13

WORKDIR /app
COPY package.json .

RUN npm config set timeout 120000
RUN npm config set registry https://registry.npm.taobao.org/

RUN npm install --only=prod

COPY . .

CMD ["npm", "start"]
