FROM node
COPY . .
EXPOSE 3001
WORKDIR Interface
COPY package*.json ./
RUN npm cache clean --force && npm install


CMD ["npm","start"]