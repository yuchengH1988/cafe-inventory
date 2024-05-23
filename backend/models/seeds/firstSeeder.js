const bcrypt = require('bcryptjs')
//載入假數據
const userData = require('./userData')
const ingredientData = require('./ingredientData')
//載入model
const Ingredient = require('../ingredient')
const User = require('../user')
const productData = require('./productData')
const compositionData = require('./compositionData')
//載入model
const Composition = require('../composition')
const Product = require('../product')
const connectMongo = require('../../common/mongodb/connectMongo')
const disconnectMongo = require('../../common/mongodb/disconnectMongo')

async function createAllSeeds () {
  try {
    await connectMongo();

    const dbUser = await User.find({}).lean()
    // create User
    if (dbUser.length) {
      console.log('users already exists !!')
    } else {
      await User.insertMany(userData.map(user => ({
        ...user,
        password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null)
      })))
      console.log('users created !!')
      await Ingredient.insertMany(ingredientData)
      console.log('ingredients created !!')
    }
    
    
    // create products
    const dbProduct = await Product.find({}).lean()

    if (dbProduct.length) {
      console.log('products already exists !!')
    } else {
      await Product.insertMany(productData)
      console.log('products created !!')
      const ingredients = await Ingredient.find()
      const products = await Product.find()
      const compositions = compositionData.map(i => {
        return {
          quantity: i.quantity,
          ingredientId: ingredients.find(item => item.name === i.ingredientName),
          productId: products.find(item => item.name === i.productName),
        }
      })
      await Composition.insertMany(compositions)
    }

    await disconnectMongo()
  } catch (err) {
    console.log(err)
    await disconnectMongo()
  }
}

createAllSeeds()
