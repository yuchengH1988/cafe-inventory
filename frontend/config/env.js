const ENV = process.env.NODE_ENV;
const PORT = process.env.NODE_PORT;

const development = 'development';
const production = 'production';

module.exports = {
  ENV,
  PORT,
  envKeyword: {
    development,
    production,
  },
};
