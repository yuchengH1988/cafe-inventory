const mongoose = require('mongoose')

// local db
// const MONGODB_local_URI = process.env.MONGODB_local_URI
// mongoose.connect(MONGODB_local_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
// docker db
const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect("mongodb://mongo:27017/cafe-inventory", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })

// 取得資料庫連線狀態
const db = mongoose.connection

db.on('error', () => {
  console.log('mongodb error!')
})

db.once('open', () => {
  console.log('mongodb connected!')
})

module.exports = db
