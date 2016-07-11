'use strict';

const request = require('request');
const service = require('../config').integrationService;
const logger = require('../lib/logger');

// dob expected as e.g. "20/06/1976"
module.exports = (num, date) => {

  let method = service.verify.method.toLowerCase();

  return new Promise((resolve, reject) => {
    request[method]({
      url: `${service.url}/${service.verify.endpoint}`,
      json: {
        membershipNumber: num,
        dob: date
      },
      timeout: service.timeout
    }, (err, response) => {
      if (err) {
        logger.error(err);
        reject(err);
      } else {
        logger.info(`🔌 integration service found match for ${num} and ${date}: ${JSON.stringify(response)}`);
        resolve(response);
      }
    });
  });
};
