const moment = require('moment')
const Ingredient = require('../ingredient')
const Record = require('../record')
const User = require('../user')

const connectMongo = require('~common/mongodb/connectMongo');
const disconnectMongo = require('~common/mongodb/disconnectMongo');

async function createRecords () {
  try {
    await connectMongo()
    const users = await User.find().lean()
    const ingredients = await Ingredient.find().lean()
    console.log('users x ingredients:', users.length, ingredients.length)
    let businessDay = new Date()
    console.log('date: ', businessDay)
    const userIngredientArray = []
    for (const { _id } of users) {
      ingredients.forEach(i => {
        userIngredientArray.push({
          authorId: _id,
          ingredientId: i._id,
          unit: i.unit2
        })
      })
    }
    const bulkOps = []

    for (i = -1; i > -100; i--) {
      let dateId = moment(businessDay).add(i, 'days').format('YYYYMMDD')
      for (const { authorId, ingredientId, unit } of userIngredientArray) {
        const estimateUsed = Math.round(unit * 10 + (Math.random() * 2 - 1) * unit * 2)
        const actualUsed = Math.round(estimateUsed + (Math.random() * 2 - 1) * unit * 1)
        bulkOps.push({
          updateOne: {
            filter: {
              dateId,
              authorId,
              ingredientId
            },
            update: {
              actualUsed,
              estimateUsed,
            },
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
          }
        })
      }
    }
    console.log('bulkOps.length', bulkOps.length)

    if (bulkOps.length) await Record.bulkWrite(bulkOps, { ordered: false })

    await disconnectMongo()

  } catch (error) {
    console.log(error);
    await disconnectMongo();
    return error;
  }
}
createRecords()
