const { ENV, envKeyword } = require('./env')

module.exports = domain(ENV);

function domain (env) {
  switch (env) {
    case envKeyword.production: {
      return {
        url:
          'https://cafe-inventory.calvin-huang.com/api',
      };
    }
    case envKeyword.development: {
      return {
        url: 'http://localhost:3000/api',
      };
    }
    default: {
      return {
        url: 'http://localhost:3000/api',
      };
    }
  }
}
