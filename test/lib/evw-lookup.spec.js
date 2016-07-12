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

    it('should return success', function () {
      return lookup('validevwnumber10', '10/10/1980')
        .should.eventually.have.property('body').contains({
          success: true
        });
    });

    it('should call logger', function (done) {
      return lookup('validevwnumber10', '10/10/1980').then(() => {
        log.info.should.have.been.called;
        done();
      }, (err) => done(err));
    });
  });

  describe('not found', function () {

  });
});