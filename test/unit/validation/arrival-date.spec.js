'use strict';

const validation = require('../../../validation/arrival-date');
const moment = require('moment');

describe('validation/arrival-date', function() {
  it('should be a valid date', function() {
    validation.rules('2016-08-32').should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.invalid'
      }
    });
  });

  it('should be less than 3 months in the future', function() {
    validation.rules(moment().add(4, 'months')).should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.to-far-in-future'
      }
    });
  });

  it('should me more than 48 hours in the future', function() {
    validation.rules(moment().add(47, 'hours')).should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.within-48-hours'
      }
    });
  });
});
