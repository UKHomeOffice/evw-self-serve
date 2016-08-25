'use strict';

const validation = require('../../validation/departure-time');
const moment = require('moment');

describe('validation/departure-time', function() {
  let model = {
    get: function (key) {
      return this.attributes[key];
    },
    attributes: {
      'arrival-date': moment().add(2, 'days').format('DD-MM-YYYY'),
      'departure-date': moment().add(2, 'days').format('DD-MM-YYYY'),
      'flightDetails': {
        'arrivalTime': '15:00'
      }
    }
  }

  it('should be a valid time', function() {
    validation.rules('Invalid date', model).should.deep.equal({
      length: {
        minimum: 100,
        message: 'departure-time.invalid'
      }
    });
  });

  it('should be no more than 1 hour after the arrival time, Marty', function() {
    validation.rules('16:01', model).should.deep.equal({
      length: {
        minimum: 100,
        message: 'departure-time.departure-after-arrival'
      }
    });
  });

  it('should be no more than 24 hours before the arrival time', function() {
    model.attributes['departure-date'] = moment().add(1, 'day').format('DD-MM-YYYY');

    validation.rules('14:59', model).should.deep.equal({
      length: {
        minimum: 100,
        message: 'departure-time.departure-too-far-before-arrival'
      }
    });
  });

  it('should not be in the next 48 hours', function() {
    model.attributes['departure-date'] = moment().add(1, 'day').format('DD-MM-YYYY');

    validation.rules('15:01', model).should.deep.equal({
      length: {
        minimum: 100,
        message: 'departure-date.within-48-hours'
      }
    });
  });
});