FROM node:16-alpine
WORKDIR /app
COPY ../package.json ../package-lock.json ./
COPY .env ./
RUN npm install
COPY public/ public
COPY src/ src
CMD ["npm", "start"]