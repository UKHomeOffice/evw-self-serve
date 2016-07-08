'use strict';

const rules = require('../../../validation/departure-time');

describe('validation/departure-time', function() {
  let model = {
    get: function (key) {
      return this.attributes[key];
    },
    attributes: {}
  }

  it('should be no more than 1 hour after the arrival time, Marty', function() {
    model.attributes = {
      'arrival-date': '2016-07-08',
      'departure-date': '2016-07-08',
      'flightDetails': {
        'arrivalTime': '15:00'
      }
    };

    rules.validate('16:01', model).should.deep.equal({
      length: {
        minimum: 12,
        message: 'departure-time.departure-after-arrival'
      }
    });
  });

  it('should be no more than 24 hours before the arrival time', function() {
    model.attributes = {
      'arrival-date': '2016-07-08',
      'departure-date': '2016-07-07',
      'flightDetails': {
        'arrivalTime': '15:00'
      }
    };

    rules.validate('14:59', model).should.deep.equal({
      length: {
        minimum: 12,
        message: 'departure-time.departure-too-far-before-arrival'
      }
    });
  });
});