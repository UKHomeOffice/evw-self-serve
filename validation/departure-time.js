'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue, model) => {
    let departureDateTime = moment(`${model.get('departure-date')} ${fieldValue}`, 'DD-MM-YYYY h:m');
    let arrivalDateTime = moment(`${model.get('arrival-date')} ${model.get('flightDetails').arrivalTime}`, 'DD-MM-YYYY h:m');

    if (fieldValue === 'Invalid date') {
      return {
        length: {
          minimum: 100,
          message: 'departure-time.invalid'
        }
      };
    }

    // We allow time travel of one hour max to compensate for time-zone hopping
    // `departure-time: 8:00` => `arrival-time: 7:00` is okay
    // `departure-time: 8:10` => `arrival-time: 7:00` is not
    if (arrivalDateTime.isBefore(departureDateTime.subtract(1, 'hour'))) {
      return {
        length: {
          minimum: 100,
          message: 'departure-time.departure-after-arrival'
        }
      };
    }

    if (departureDateTime.isBefore(arrivalDateTime.subtract(24, 'hours'))) {
      return {
        length: {
          minimum: 100,
          message: 'departure-time.departure-too-far-before-arrival'
        }
      };
    }

    return false;
  }
};
