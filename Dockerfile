FROM node:16-alpine

RUN npm install -g nodemon 

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 4000

#can be start if production but need to specify in package.json
CMD ["npm", "run", "dev"]
