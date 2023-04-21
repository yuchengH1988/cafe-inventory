const mongoose = require('mongoose')
const Schema = mongoose.Schema
const userSchema = new Schema({
  ingredientId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Ingredient'
  },
  quantity: {
    type: Number,
    required: true
  },
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Product'
  },
}, { versionKey: false })

module.exports = mongoose.model('Composition', userSchema)