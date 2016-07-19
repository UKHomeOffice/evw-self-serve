'use strict';

let EmailUsController = require('../../../../apps/update-journey-details/controllers/email-us');

describe('apps/update-journey-details/controllers/email-us', function () {

  describe('#locals', function () {

    let controller;
    let req;
    let res;

    beforeEach(function () {
      req = {
        params: {},
        form: {
          values: {
          }
        },
        sessionModel: {
          get: sinon.stub(),
          toJSON: sinon.stub().returns({
            'transport-options': 'by-plane'
          })
        }
      };
      res = {};

      controller = new EmailUsController({template: 'index'});
    });

    it('calls session model toJSON', function () {
      controller.locals(req, res);

      req.sessionModel.toJSON.should.have.been.calledOnce;
    });

    it('adds transport and list', function () {
      let ret = controller.locals(req, res);
      ret.should.have.property('transport').eql('by-plane');
      ret.should.have.property('list').to.be.instanceof(Array);
    });

  });

});
