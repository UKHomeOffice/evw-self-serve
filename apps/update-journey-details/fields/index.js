'use strict';

var _ = require('underscore');

module.exports = _.extend(
  require('./how-will-you-arrive'),
  require('./second-page'),
  require('./third-page'),
  require('./fourth-page')
);
