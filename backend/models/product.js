const mongoose = require('mongoose')
const Schema = mongoose.Schema
const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  size: {
    type: String
  },
  price: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true, versionKey: false })
module.exports = mongoose.model('Product', productSchema)