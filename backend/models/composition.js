const mongoose = require('mongoose')
const Schema = mongoose.Schema
const compositionSchema = new Schema({
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
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('Composition', compositionSchema)