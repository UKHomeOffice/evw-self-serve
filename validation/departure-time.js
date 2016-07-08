'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue, model) => {
    let departureDateTime = moment(`${model.get('departure-date')} ${fieldValue}`, 'YYYY-M-D h:m');
    let arrivalDateTime = moment(`${model.get('arrival-date')} ${model.get('flightDetails').arrivalTime}`, 'YYYY-M-D h:m');

    // We allow time travel of one hour max to compensate for time-zone hopping
    // `departure-time: 8:00` => `arrival-time: 7:00` is okay
    // `departure-time: 8:10` => `arrival-time: 7:00` is not
    if (moment(arrivalDateTime).isBefore(moment(departureDateTime).subtract(1, 'hour'))) {
      return {
        length: {
          minimum: 12,
          message: 'departure-time.departure-after-arrival'
        }
      };
    }

    if (moment(departureDateTime).isBefore(moment(arrivalDateTime).subtract(24, 'hours'))) {
      return {
        length: {
          minimum: 12,
          message: 'departure-time.departure-too-far-before-arrival'
        }
      };
    }

    return false;
  }
};
