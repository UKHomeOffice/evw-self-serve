const request = require('request');
const service = require('../config').integrationService;
const moment = require('moment');
const logger = require('../lib/logger');

module.exports = {
  findApplication: function(evwNumber, dateOfBirth) {
    var method = service.verify.method.toLowerCase();

    return new Promise((resolve, reject) => {
      request[method]({
        url: `${service.url}/${service.verify.endpoint}`,
        json: { membershipNumber: evwNumber, dob: dateOfBirth },
        timeout: service.timeout
      }, function (err, response) {
        if (err) {
          logger.error(err);
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  },
  formatPost: function(formValues) {
    return {
      // sanitise user input
      evwNumber: formValues['evw-number'],
      dateOfBirth: moment([
        formValues['dob-day'],
        formValues['dob-month'],
        formValues['dob-year']
      ].reverse().join('-'), 'YYYY-M-D').format('YYYY-MM-DD')
    };
  },
  mapResponse: function(response) {
    if (response.success) {
      return 'success';
    }

    return response.error;
  }
};
