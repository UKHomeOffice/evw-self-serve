'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue, model) => {
    let date = moment(`${fieldValue} ${model.get('flightDetails').arrivalTime}:00`, 'DD-MM-YYYY HH:mm:ss');
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

    if (threeMonths.isBefore(date, 'second')) {
      return {
        length: {
          minimum: 12,
          message: 'arrival-date.too-far-in-future'
        }
      };
    }

    if (fourtyEight.isAfter(date, 'second')) {
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
