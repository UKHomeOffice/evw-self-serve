'use strict';

const validation = require('../../../validation/evw-number');

describe('validation/evw-number', function() {
  let model = {
    get: function (key) {
      return this.attributes[key];
    },
    attributes: {}
  }

  describe('evwLookupError is equal to CASE_NOT_FOUND', function() {
    before(function() {
      model.attributes = {
        evwLookupError: 'CASE_NOT_FOUND'
      };
    });

    it('returns the validation rules', function() {
      validation.rules('', model).should.deep.equal({
        length: {
          minimum: 999,
          tooShort: 'evw-number.not-found'
        }
      });
    });
  });

  describe("evwLookupError is undefined", function() {
    before(function() {
      model.attributes = {};
    });

    it('returns undefined', function() {
      should.equal(validation.rules('', model), undefined);
    });
  });
});