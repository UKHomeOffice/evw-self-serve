'use strict';

var winston = require('winston');
var config = require('../config');
var loggingTransports = [];
var exceptionTransports = [];
var levels = {
  info: 0,
  email: 1,
  warn: 2,
  error: 3
};
var colors = {
  info: 'green',
  email: 'magenta',
  warn: 'yellow',
  error: 'red'
};
// Format nested json objects into array-style strings
let formatMeta = (meta) => {
  if (Object.keys(meta).length) {
    let formatted = [];
    console.log(meta);
    Object.keys(meta).forEach(function(key) {
      console.log(key)
      if (typeof meta[key] === 'object') {
        console.log(meta[key]);
        if (meta[key] && Object.keys(meta[key]).length) {
          let metaVals = formatMeta(meta[key]);
          if (isNaN(key)) {
            metaVals = `${key}=[${metaVals}]`;
          }
          formatted.push(metaVals);
        }
      } else {
        formatted.push(`${key}=${meta[key]}`);
      }
    });
    return formatted.join(', ');
  }
};
let formatMessage = (options) => {
  let metaValues = formatMeta(options.meta);

  if (options.message && metaValues) {
    return `${options.message}: ${metaValues}`;
  }

  return options.message || metaValues;
}
let loggingTransport = () => {
  return new (winston.transports.Console)({
    timestamp: () => {
      return new Date().toISOString()
    },
    colorize: true,
    formatter: (options) => {
      return [
        `[${config.appName}]`,
        `[${options.level.toUpperCase()}]`,
        options.timestamp(),
        formatMessage(options)
      ].join(' ');
    }
  });
}

loggingTransports.push(loggingTransport());
exceptionTransports.push(loggingTransport());

// Shut up mocha!
if (config.env === 'test') {
  loggingTransports = [];
}

var transports = {
  levels: levels,
  transports: loggingTransports,
  exceptionHandlers: exceptionTransports,
  exitOnError: true
};

var logger = new (winston.Logger)(transports);

winston.addColors(colors);

module.exports = logger;
