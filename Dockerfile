FROM node:18

EXPOSE 3333

WORKDIR /app

RUN npm i npm@latest -g

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
