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

  describe('found', function () {
    it('should do what...', function () {
      let result = lookup('validevwnumber10', '10/10/1980');

      // log.info.should.have.been.calledWith('');

      return result.should.eventually.have.property('body').contains({
        success: false
      });

    });
  });

  describe('not found', function () {

  });
});