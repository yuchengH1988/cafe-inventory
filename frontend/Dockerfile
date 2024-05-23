FROM node:16-alpine
COPY . /app/frontend/
WORKDIR /app/frontend/
RUN npm install
RUN npm install -g http-server
RUN npm run prod_build
EXPOSE 8080
CMD ["http-server", "dist"]
