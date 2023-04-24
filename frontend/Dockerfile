FROM node:16
COPY . /app/frontend/
WORKDIR /app/frontend/
RUN npm install
EXPOSE 8080
CMD ["npm", "run", "serve"]
