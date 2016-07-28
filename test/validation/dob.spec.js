'use strict';

const validation = require('../../validation/dob');
const moment = require('moment');

describe('validation/dob', function() {
  it('should be a valid date', function() {
    validation.rules('00-00-0000').should.deep.equal({
      length: {
        minimum: 100,
        message: 'dob.invalid'
      }
    });
  });
});
