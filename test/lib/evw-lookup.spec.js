'use strict';

const proxyquire = require('proxyquire');
const log = {
  info: sinon.spy(),
  error: sinon.spy()
};
let lookup;

describe('evw-lookup', function () {

  lookup = proxyquire('../../lib/evw-lookup', {
    logger: log
  });

  it('should exist', function () {
    lookup.should.exist;
  });

  /* eslint no-warning-comments: 1 */
  // TODO check logger calls using stubbed spies
  describe('found', function () {

    it('should return success', function () {
      return lookup.find('validevwnumber10', '10/10/1980')
        .should.eventually.have.property('body').contains({
          success: true
        });
    });

  });

  describe('not found', function () {
    describe('too late', function () {
      it('should error', function () {
        return lookup.find('1000INVALID', '10/10/1980')
          .should.eventually.have.property('body').contains({
            error: 'CASE_NOT_FOUND'
          });
      });
    });

    describe('case not found', function () {
      it('should error', function () {
        return lookup.find('TOOLATEM8', '10/10/1980')
          .should.eventually.have.property('body').contains({
            error: 'CASE_NOT_UPDATABLE'
          });
      });
    });
  });
});