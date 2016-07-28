'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue) => {
    let date = moment(fieldValue, 'DD-MM-YYYY');

    if (!date.isValid()) {
      return {
        length: {
          minimum: 100,
          message: 'dob.invalid'
        }
      };
    }

    return false;
  }
};
