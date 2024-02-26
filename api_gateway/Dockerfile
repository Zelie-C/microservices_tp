FROM node:20-alpine
WORKDIR /usr/src/index
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["npm","run", "start"]
