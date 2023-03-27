require('dotenv').config({
  path: require('path').join(__dirname, '.env')
});
const { unionId } = require('../util');

module.exports = {
  url: 'http://0.0.0.0:9000',
  user: {
    name: unionId(),
    password: 'q`1234'
  },
}