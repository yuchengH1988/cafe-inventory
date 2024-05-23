FROM node:16-alpine
COPY . /app/backend/
WORKDIR /app/backend/
RUN npm install

EXPOSE 3000
CMD ["npm", "run", "server_prod"]
