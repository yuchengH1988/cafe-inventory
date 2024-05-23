const mongoose = require('mongoose');

const mongodbConfig = require('~config/mongodbConfig');

mongoose.set('autoCreate', false);

module.exports = async function connectMongo() {
  try {
    mongoose.set('strictQuery', true);
    console.log('mongodbConfig.mongoUrl', mongodbConfig.mongoUrl)
    const result = await mongoose.connect(mongodbConfig.mongoUrl, {
      autoIndex: false,
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connect successful.');
    return result;
  } catch (err) {
    console.log(err);
    console.log('MongoDB connection failed');
    return process.exit(1);
  }
};
