const User = require('../../models/user')
const Product = require('../../models/product')
const Record = require('../../models/record')
const Ingredient = require('../../models/ingredient')
const Composition = require('../../models/composition')
const bcrypt = require('bcryptjs')
const moment = require('moment')

const adminController = {
  createUser: async (req, res, next) => {
    try {
      const { account, name, email, password, checkPassword, isAdmin } = req.body
      // 確認 account & name & email & password & checkPassword 必填
      if (!account || !name || !email || !password || !checkPassword) {
        return res.status(400).json({ status: 400, message: 'account, name, email, password, checkPassword are required!' })
      }
      // 確認 password & checkPassword 相同
      if (password !== checkPassword) {
        return res.status(400).json({ status: 400, message: 'password & checkPassword must be same!' })
      }

      // 確認 email 格式正確
      const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
      if (!emailRule.test(email)) {
        return res.status(400).json({ status: 400, message: 'email format is incorrect!' })
      }
      //判斷帳號、名稱是否存在
      const user = await User.find({ $or: [{ account }, { name }] })
      if (user.length) { return res.status(409).json({ status: 409, message: 'this account or name has been used!' }) }
      //新增User
      await User.create({
        account, name, email, isAdmin,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
      })

      return res.status(200).json({ status: 200, message: 'register success!' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  toggleAdmin: async (req, res, next) => {
    try {
      const _id = req.params.id
      let user = await User.findById(_id)
      user.isAdmin = user.isAdmin ? false : true
      await user.save()
      return res.status(200).json({ status: 200, message: `user ${user.name} ${user.account} have changed to ${user.isAdmin ? 'Admin' : 'User'}` })

    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteUser: async (req, res, next) => {
    try {
      const _id = req.params.id
      await User.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(404).json({ status: 404, message: "Can't delete this User." })
        } else {
          return res.status(200).json({ status: 200, message: 'The User has removed successfully!' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getUsers: async (req, res, next) => {
    try {
      const users = await User.find({})
      return res.status(200).json({ status: 200, users })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  createProduct: async (req, res, next) => {
    try {
      const { name, size, price } = req.body
      const product = await Product.find({ name, size })
      if (product.length !== 0) {
        return res.status(400).json({ status: 400, message: 'Both name and size have been registered at same product' })
      }
      await Product.create({
        name, size, price
      })
      return res.status(200).json({ status: 200, message: 'Product have been built.' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Product.findById(_id, (err, product) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find this product' })
        } else {
          return res.status(200).json({ status: 200, product })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  updateProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      const { name, size, price } = req.body
      await Product.findByIdAndUpdate(_id, { name, size, price }, { useFindAndModify: false, new: true }, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Product has been updated.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteProduct: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Product.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Product has been deleted.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },

  getIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Ingredient.findById(_id, (err, ingredient) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find this ingredient' })
        } else {
          return res.status(200).json({ status: 200, ingredient })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  createIngredient: async (req, res, next) => {
    try {
      const { name, unit, unitName, unit2, unit2Name } = req.body
      const ingredient = await Ingredient.find({ name })
      if (ingredient.length !== 0) {
        return res.status(400).json({ status: 400, message: 'This name have been registered in ingredient' })
      }
      await Ingredient.create({
        name, unit, unitName, unit2, unit2Name
      })
      return res.status(200).json({ status: 200, message: 'New ingredient have been built.' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  updateIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      const { name, unit, unitName, unit2, unit2Name } = req.body
      await Ingredient.findByIdAndUpdate(_id, { name, unit, unitName, unit2, unit2Name }, { useFindAndModify: false, new: true }, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Ingredient has been updated.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteIngredient: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Ingredient.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Ingredient has been deleted.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getCompositions: async (req, res, next) => {
    try {
      await Composition.find({}, (err, compositions) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the product' })
        } else {
          return res.status(200).json({ status: 200, compositions })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  getComposition: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Composition.findById(_id, (err, composition) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find this ingredient' })
        } else {
          return res.status(200).json({ status: 200, composition })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  createComposition: async (req, res, next) => {
    try {
      const { quantity, ingredientId, productId } = req.body
      const composition = await Composition.find({ ingredientId, productId })
      if (!quantity || quantity == 0) {
        return res.status(400).json({ status: 400, message: 'Quantity can\'t be 0.' })
      }
      if (composition.length !== 0) {
        return res.status(400).json({ status: 400, message: 'This composition have already registered' })
      }
      await Composition.create({ quantity, ingredientId, productId })
      return res.status(200).json({ status: 200, message: 'New composition have been built.' })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  updateComposition: async (req, res, next) => {
    try {
      const _id = req.params.id
      const { quantity } = req.body
      if (!quantity || quantity == 0) {
        return res.status(400).json({ status: 400, message: 'Quantity can\'t be 0.' })
      }
      await Composition.findByIdAndUpdate(_id, { quantity }, { useFindAndModify: false, new: true }, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Composition has been updated.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  },
  deleteComposition: async (req, res, next) => {
    try {
      const _id = req.params.id
      await Composition.findByIdAndDelete(_id, (err) => {
        if (err) {
          return res.status(400).json({ status: 400, message: 'Can\'t find the id' })
        } else {
          return res.status(200).json({ status: 200, message: 'Composition has been deleted.' })
        }
      })
    } catch (error) {
      console.log(error)
      return next(error)
    }
  }
}
module.exports = adminController