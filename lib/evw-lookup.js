'use strict';

const request = require('request');
const service = require('../config').integrationService;
const moment = require('moment');
const logger = require('../lib/logger');

// sanitise user input
const format = (formValues) => {
  return {
    evwNumber: formValues['evw-number'],
    dateOfBirth: moment([
      formValues['dob-year'],
      formValues['dob-month'],
      formValues['dob-day']
    ].join('-'), 'YYYY-M-D').format('YYYY-MM-DD')
  };
};

// dob expected as e.g. "20/06/1976"
const find = (num, date) => {

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
        logger.info(`integration service found match for ${num} and ${date}: ${JSON.stringify(response.body)}`);
        return resolve(response);
      }
    });
  });
};

module.exports = {
  format: format,
  find: find
}