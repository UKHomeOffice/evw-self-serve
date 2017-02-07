'use strict';

const FlightNumberController = require('../../../../apps/update-journey-details/controllers/flight-number');
const controller = new FlightNumberController({template: 'flight-number'});
const EvwBaseController = require('../../../../apps/common/controllers/evw-base');

describe('apps/update-journey-details/controllers/flight-number', function () {
  let req;
  let res;
  let callback;

  beforeEach(function() {
    req = {
      sessionModel: {
        set: sinon.spy(),
        attributes: {
          'is-this-your-flight': 'Yes'
        }
      }
    };
    res = {};
    callback = sinon.spy();
  });

  describe('process', function() {
    let processStub;
    beforeEach(function() {
      processStub = sinon.stub(EvwBaseController.prototype, 'process');
      processStub.yields();
      controller.process(req, res, callback);
    });

    afterEach(function() {
      processStub.restore();
    });

    it('resets the value', function() {
      req.sessionModel.set.should.have.been.calledOnce.calledWith('is-this-your-flight', null);
    });

    it('calls parent process', function() {
      processStub.should.have.been.calledOnce.calledWith(req, res, callback);
    });

    it('calls the callback', function() {
      callback.should.have.been.calledOnce;
    });

  });
});
