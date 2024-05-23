const express = require('express')
const cors = require('cors')
const http = require('http')
const router = require('./routes/router')
const path = require('path')
require('dotenv').config({ path: path.resolve(__dirname, './.env.example') })
const connectMongo = require('./common/mongodb/connectMongo')
const disconnectMongo = require('./common/mongodb/disconnectMongo')
const { setServerReady } = require('./common/utils/ready');

function main() {
  const app = expressServer()
  const SERVER = http.createServer(app);
  startServer(SERVER);

  process.on('SIGINT', () => {
    console.info('SIGINT signal received.');
    closeServer(SERVER);
  });
}

main()

function expressServer() {
  const app = express()
  app.use(cors())
  app.use(express.urlencoded({ limit: '10mb', extended: true }))
  app.use(express.json({ limit: '10mb', extended: true }))
  app.use(router)
  app.get('/', (req, res) => {
    res.send('hello cafe lover')
  })
  app.use((err, req, res, next) => {
    if (err) {
      res.status(500).json({ message: String(err) })
      return next()
    }
  })

  return app
}

async function startServer (SERVER) {
  const PORT = process.env.NODE_PORT || 3000;

  await connectMongo();
  setServerReady(true);
  SERVER.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port: ${PORT}`);
    console.log(`The environment is: ${process.env.NODE_ENV}`);
  });
}

function closeServer (SERVER) {
  setServerReady(false);
  console.log('Closing http server.');
  SERVER.close(async (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    await disconnectMongo();
    console.log('Http server closed.');
    process.exit(0);
  });
}
