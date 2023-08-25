FROM node:16-alpine
COPY . /app/frontend/
WORKDIR /app/frontend/
RUN npm install
RUN npm install -g http-server
EXPOSE 8080
CMD ["http-server", "dist"]
