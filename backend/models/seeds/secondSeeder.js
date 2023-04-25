if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const db = require('../../config/mongoose')
//載入假數據
let products = require('./products')
let compositions = require('./compostions')
const Ingredient = require('../ingredient')
//載入model
const Composition = require('../composition')
const Product = require('../product')
db.once('open', async () => {
  try {
    const dbProduct = await Product.find({}).lean()

    if (dbProduct.length) {
      console.log('products already exists !!')
    } else {
      await Product.insertMany(products)
      console.log('products created !!')
      const ingredients = await Ingredient.find()
      products = await Product.find()
      compositions = compositions.map(i => {
        return {
          quantity: i.quantity,
          ingredientId: ingredients.find(item => item.name === i.ingredientName),
          productId: products.find(item => item.name === i.productName),
        }
      })
      await Composition.insertMany(compositions)
    }
   
    db.close()

  } catch (error) {
    console.log(error)
    db.close()
  }
})