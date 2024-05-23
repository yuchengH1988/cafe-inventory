const mongoose = require('mongoose');

module.exports = async function disconnectMongo() {
  await mongoose.connection.close(false);
  console.log('MongoDb connection closed.');
};
