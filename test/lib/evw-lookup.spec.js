'use strict';

const proxyquire = require('proxyquire');
const log = {
  info: sinon.spy(),
  error: sinon.spy()
};
let lookup;

describe('lib/evw-lookup', function () {

  // bring up evw-integration-stub
  before(function (done){
    this.dyson = dysonServer({
      mocks: './node_modules/evw-integration-stub/mocks',
      port: 9300,
      name: 'integration service stub'
    }, done);
  });

  after(function () {
    this.dyson.kill();
  });

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
          emailAddress: 'someone@example.com'
        });
    });

  });

  describe('not found', function () {
    describe('too late', function () {
      it('should error', function () {
        return lookup.find('TOOLATEM8', '10/10/1980')
          .should.eventually.have.property('body').contains({
            error: 'CASE_EXPIRED'
          });
      });
    });

    describe('case not found', function () {
      it('should error', function () {
        return lookup.find('NOFOUND', '10/10/1980')
          .should.eventually.have.property('body').contains({
            error: 'CASE_NOT_FOUND'
          });
      });
    });

  });

  describe('#format', function() {
    let formValues;

    it('should format the posted params', function() {
      formValues = {
        'evw-number': 'EVW123',
        'dob-day': '09',
        'dob-month': '08',
        'dob-year': '2016',
      };

      lookup.format(formValues).should.deep.equal({
        evwNumber: 'EVW123',
        dateOfBirth: '2016-08-09'
      });
    });

    describe('slightly less pretty values', function () {

      it('formats correctly', function () {
        formValues = {
          'evw-number': 'EVW123',
          'dob-day': '9',
          'dob-month': '8',
          'dob-year': '2016',
        };

        lookup.format(formValues).should.deep.equal({
          evwNumber: 'EVW123',
          dateOfBirth: '2016-08-09'
        });
      });
    });

  });
});