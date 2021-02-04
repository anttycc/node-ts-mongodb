FROM node:latest as prod

WORKDIR /app
 
COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

COPY src/swagger.json ./dist/src/

COPY public ./dist/public


ENV NODE_ENV=production

CMD ["npm", "run", "start:app"]


