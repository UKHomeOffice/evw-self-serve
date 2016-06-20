'use strict';

module.exports = Object.assign(
  require('./how-will-you-arrive'),
  require('./email-us'),
  require('./enter-your-details')
);

// let f = require('fs').readdirSync(__dirname).forEach((file) => {
//   if (file !== 'index.js') {
//     console.log(__dirname + '/' + file);
//   }
// });