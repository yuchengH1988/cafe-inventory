const { ENV, envKeyword } = require('./env')

module.exports = mongodb(ENV);

function mongodb(env) {
  switch (env) {
    case envKeyword.production: {
      return {
        mongoUrl:
          'mongodb://mongo',
      };
    }
    case envKeyword.development: {
      return {
        mongoUrl: 'mongodb://127.0.0.1:27017/cafe-inventory',
      };
    }
    default: {
      return {
        mongoUrl: 'mongodb://127.0.0.1:27017/cafe-inventory',
      };
    }
  }
}
