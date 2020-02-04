'use strict';

const modelFixture = require('../fixtures/update-model');
const logger = require('../../lib/logger');
const path = require('path');
const ConfirmationController = require('../../apps/update-journey-details/controllers/confirmation');

describe('transform, validate and post to integration service', function() {
  let req;
  let res;
  let controller;

  before(function(done) {
    const dir = path.resolve(__dirname, '../../node_modules/evw-integration-stub/mocks');
    this.dyson = dysonServer({
      mocks: dir,
      port: 9300,
      name: 'Integration service stub'
    }, done);
  });

  beforeEach(function() {
    req = {
      sessionModel: {
        attributes: Object.assign({}, modelFixture),
        reset: sinon.spy()
      }
    };
    res = {};
    sinon.spy(logger, 'error');
    controller = new ConfirmationController({template: 'confirmation'});
  });

  afterEach(function() {
    logger.error.restore();
  });

  after(function() {
    this.dyson.kill();
  });

  describe('on success', function() {
    it('calls callback with no error', function(done) {
      controller.getValues(req, res, err => {
        should.equal(undefined, err);
        done();
      });
    });

    it('does not log any errors', function(done) {
      controller.getValues(req, res, err => {
        logger.error.should.not.have.been.called;
        done();
      });
    });
  });

  describe('if validate fails', function() {
    before(function() {
      req.sessionModel.attributes.flightDetails.flightNumber = null;
    });

    after(function() {
      req.sessionModel.attributes.flightDetails.flightNumber = 'EK009';
    });

    it('calls callback with validation error', function(done) {
      controller.getValues(req, res, err => {
        err.should.have.property('errors');
        err.should.not.have.property('valid', true);
        done();
      });
    });

    it('logs the error', function(done) {
      controller.getValues(req, res, err => {
        logger.error.should.have.been.calledOnce;
        logger.error.should.have.been.calledWith('error schema validating update', 'ABC1234', err);
        done();
      });
    });
  });

  describe('if post fails', function() {
    beforeEach(function() {
      const is = require('../../config').integrationService;
      is.url = 'http://localhost:9999';
    });

    afterEach(function() {
      const is = require('../../config').integrationService;
      is.url = 'http://localhost:9300';
    });

    it('calls callback with request error', function(done) {
      controller.getValues(req, res, err => {
        err.should.have.property('code', 'ECONNREFUSED');
        done();
      });
    });

    it('logs the error', function(done) {
      controller.getValues(req, res, err => {
        logger.error.should.have.been.calledOnce;
        logger.error.should.have.been.calledWith('error sending update to integration service', err);
        done();
      });
    });
  });

});
