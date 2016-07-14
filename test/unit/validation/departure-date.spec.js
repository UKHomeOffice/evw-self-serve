'use strict';

const validation = require('../../../validation/departure-date');
const moment = require('moment');

describe('validation/departure-date', function() {
  let model = {
    get: function (key) {
      return this.attributes[key];
    },
    attributes: {}
  }

  it('should be a valid date', function() {
    model.attributes = {
      'arrival-date': moment().subtract(1, 'day')
    }

    validation.rules('32-08-2016', model).should.deep.equal({
      length: {
        minimum: 12,
        message: 'departure-date.invalid'
      }
    });
  });

  it('should be less than 1 day in the past', function() {
    model.attributes = {
      'arrival-date': moment().add(2, 'days')
    }

    validation.rules(moment(), model).should.deep.equal({
      length: {
        minimum: 12,
        message: 'departure-date.in-past'
      }
    });
  });

  it('should be more than 1 day in the future', function() {
    model.attributes = {
      'arrival-date': moment().subtract(2, 'days')
    }

    validation.rules(moment(), model).should.deep.equal({
      length: {
        minimum: 12,
        message: 'departure-date.in-future'
      }
    });
  });
});
