'use strict';

const validation = require('../../validation/arrival-date');
const moment = require('moment');

describe('validation/arrival-date', function() {
  it('should be a valid date', function() {
    validation.rules('32-08-2016').should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.invalid'
      }
    });
  });

  it('should be less than 3 months in the future', function() {
    validation.rules(moment().add(4, 'months').format('DD-MM-YYYY')).should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.too-far-in-future'
      }
    });
  });

  it('should be more than 48 hours in the future', function() {
    validation.rules(moment().add(1, 'day').format('DD-MM-YYYY')).should.deep.equal({
      length: {
        minimum: 12,
        message: 'arrival-date.within-48-hours'
      }
    });
  });
});
