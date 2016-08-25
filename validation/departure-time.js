'use strict';

const moment = require('moment');

module.exports = {
  rules: (fieldValue, model) => {
    let departureDateTime = moment(`${model.get('departure-date')} ${fieldValue}`, 'DD-MM-YYYY h:m');
    let departureDateTimeMinusOneHour = departureDateTime.clone().subtract(1, 'hour');
    let arrivalDateTime = moment(`${model.get('arrival-date')} ${model.get('flightDetails').arrivalTime}`, 'DD-MM-YYYY h:m');
    let arrivalDateTimeMinusTwentyFourHours = arrivalDateTime.clone().subtract(24, 'hours');
    let fourtyEight = moment().add(48, 'hours');

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
    if (arrivalDateTime.isBefore(departureDateTimeMinusOneHour)) {
      return {
        length: {
          minimum: 100,
          message: 'departure-time.departure-after-arrival'
        }
      };
    }

    if (departureDateTime.isBefore(arrivalDateTimeMinusTwentyFourHours)) {
      return {
        length: {
          minimum: 100,
          message: 'departure-time.departure-too-far-before-arrival'
        }
      };
    }

    if (fourtyEight.isAfter(departureDateTime, 'minute')) {
      return {
        length: {
          minimum: 100,
          message: 'departure-date.within-48-hours'
        }
      };
    }

    return false;
  }
};
