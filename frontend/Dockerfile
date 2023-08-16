FROM node:16-alpine
COPY . /app/frontend/
WORKDIR /app/frontend/
RUN npm install -g http-server @vue/cli
RUN npm run build
EXPOSE 8080
CMD ["http-server", "dist"]
