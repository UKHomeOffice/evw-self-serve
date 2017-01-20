'use strict';

const CheckYourAnswersController = require('../../../../apps/update-journey-details/controllers/check-your-answers');
const EvwBaseController = require('../../../../apps/common/controllers/evw-base');

describe('apps/update-journey-details/controllers/check-your-answers', function() {
  let controller;
  let req;
  let res;

  beforeEach(function() {
    req = {
      sessionModel: {
        get: sinon.stub()
      }
    };
    controller = new CheckYourAnswersController({
      template: 'check-your-answers'
    });
  });

  describe('#locals', function() {
    let localsStub;

    beforeEach(function() {
      localsStub = sinon.stub(EvwBaseController.prototype, 'locals');
      localsStub.returns({});
    });

    afterEach(function() {
      localsStub.restore();
    });

    it('calls parent locals', function() {
      controller.locals(req, res);
      localsStub.should.have.been.calledOnce.calledWith(req, res);
    });

    it('adds knowDepartureDetailsYes to locals', function() {
      req.sessionModel.get.returns('Yes');
      controller.locals(req, res).should.deep.equal({
        knowDepartureDetailsYes: true,
        knowDepartureDetailsNo: false
      });
    });

    it('adds knowDepartureDetailsNo to locals', function() {
      req.sessionModel.get.returns('No');
      controller.locals(req, res).should.deep.equal({
        knowDepartureDetailsYes: false,
        knowDepartureDetailsNo: true
      });
    });
  });

});
