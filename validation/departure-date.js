'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue, model) => {
    let departureDate = moment(fieldValue, 'YYYY-M-D');
    let arrivalDateMinusOneDay = moment(model.get('arrival-date')).subtract(1, 'day');
    let arrivalDatePlusOneDay = moment(model.get('arrival-date')).add(1, 'day');

    if (!departureDate.isValid()) {
      return {
        length: {
          minimum: 12,
          message: 'departure-date.invalid'
        }
      };
    }

    if (departureDate.isBefore(arrivalDateMinusOneDay)) {
      return {
        length: {
          minimum: 12,
          message: 'departure-date.in-past'
        }
      };
    }

    if (departureDate.isAfter(arrivalDatePlusOneDay)) {
      return {
        length: {
          minimum: 12,
          message: 'departure-date.in-future'
        }
      };
    }

    return false;
  }
};
