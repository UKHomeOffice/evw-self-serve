'use strict';

const moment = require('moment');

function validateDepartureDate(arrivalDateTime, departureDateTime, allowTimeTravel) {
  if (!arrivalDateTime.isValid() || !departureDateTime.isValid()) {
    return false;
  }
  const departureWithin48Hours = () => {
    const twoDaysInFuture = moment().add(2, 'days');
    return departureDateTime.isValid() && departureDateTime.isBefore(twoDaysInFuture);
  };
  const departureNotWithin24HoursOfArrival = () => {
    return departureDateTime.diff(arrivalDateTime, 'hours', true) < -24;
  };
  const departureAfterArrival = () => {
    if (allowTimeTravel) {
      arrivalDateTime = arrivalDateTime.add(1, 'hour');
    }
    return arrivalDateTime.isValid() && departureDateTime.isValid() && departureDateTime.isAfter(arrivalDateTime);
  };

  if (departureWithin48Hours()) {
    return 'travel-too-soon';
  }
  if (departureNotWithin24HoursOfArrival()) {
    return 'depart-24-hours-before-arrive';
  }
  if (departureAfterArrival()) {
    return 'depart-after-arrive';
  }
  return false;
}

module.exports = {
  beforeDate: function beforeDate(value, limit) {
    return moment(value).isBefore(moment(limit));
  },
  afterDate: function afterDate(value, limit) {
    return moment(value).isAfter(moment(limit));
  },
  validTime: function validTime(value) {
    return value === 'Invalid date';
  },
  validateDepartureDate: validateDepartureDate
};
