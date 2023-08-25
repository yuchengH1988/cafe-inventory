const mongoose = require('mongoose')
const Schema = mongoose.Schema
const recordSchema = new Schema({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  ingredientId: {
    type: Schema.Types.ObjectId,
    ref: 'Ingredient'
  },
  dateId: {
    type: String,
    require: true
  },
  actualUsed: {
    type: Number,
    required: true,
    default: 0
  },
  estimateUsed: {
    type: Number,
    required: true,
    default: 0
  }
}, { timestamps: true })

recordSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Record', recordSchema)