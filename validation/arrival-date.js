'use strict';

const moment = require('moment');

module.exports = {
  validate: (fieldValue) => {
    let date = moment(fieldValue, 'YYYY-M-D');
    let threeMonths = moment().add(3, 'months');
    let fourtyEight = moment().add(48, 'hours');

    if (!date.isValid()) {
      return {
        length: {
          minimum: 12,
          message: 'arrival-date.invalid'
        }
      };
    }

    if (threeMonths.isBefore(date)) {
      return {
        length: {
          minimum: 12,
          message: 'arrival-date.to-far-in-future'
        }
      };
    }

    if (fourtyEight.isAfter(date)) {
      return {
        length: {
          minimum: 12,
          message: 'arrival-date.within-48-hours'
        }
      };
    }

    return false;
  }
};
