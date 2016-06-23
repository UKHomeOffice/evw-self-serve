'use strict';

var _ = require('underscore');

module.exports = _.extend(
  require('./how-will-you-arrive'),
  require('./email-us'),
  require('./flight-number'),
  require('./third-page')
);
