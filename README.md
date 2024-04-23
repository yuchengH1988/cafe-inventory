# Cafe Inventory System

  A system helps the cafe store to calculate accurately the difference between daily usage and expected. After stored records, you can review month reports with different ingredients.
  With Admin permission, you can create beverages with custom impositions, and setting up new ingredients is also available, so you can build two different units of measurement. Admin can build new branches(new accounts) and give authorization.

## Installation and Execution

### Localhost

1. Download projects: Use terminal, create a new repository for download the files.

  ```js
  git clone https://github.com/yuchengH1988/restaurant_list
  ```

2. install npm

```js
npm install
```

3. run seeds

```js
npm run seed

npm run fakeRecord
```

4. open backend and frontend

```js
cd backend
npm run dev
```

```js
cd frontend
npm run serve
```

5. open website <http://localhost:8080>

6. login with available account

| permission  | account | password |
| ----- | --------------- | ---------------- |
| Admin | admin           | 1234             |
| User  | a0001           | 1234             |
| User  | a0002           | 1234             |

### docker

1. open with your docker

  ```js
  docker-compose up
  ```

2. connect into backend container and create fake records

```js
  docker exec -it "container Id" /bin/sh

  npm run seed
  npm run fakeRecord
```

3. open website <http://localhost:8080>

4. login with available account
