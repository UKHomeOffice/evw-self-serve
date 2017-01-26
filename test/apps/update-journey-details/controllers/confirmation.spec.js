'use strict';

const moment = require('moment');
const modelFixture = require('../../../fixtures/update-model');
const proxyquire = require('proxyquire');

describe('apps/update-journey-details/controllers/confirmation', function () {
  let ConfirmationController;
  let controller;
  let mockRequest;
  let mockJsonSchema;
  let validateStub;
  let model;

  beforeEach(function() {
    model = Object.assign({}, modelFixture);
    mockRequest = {
      post: sinon.stub().yields(null, null, {
        membershipNumber: '123ABC',
        currentDetails: {
          contactDetails: {
            emailAddress: 'test@example.com'
          }
        }
      })
    };
    validateStub = sinon.stub().returns({valid: true});
    mockJsonSchema = {
      Validator: sinon.stub().returns({
        validate: validateStub
      })
    };
    ConfirmationController = proxyquire('../../../../apps/update-journey-details/controllers/confirmation', {
      'request': mockRequest,
      'jsonschema': mockJsonSchema
    });
    controller = new ConfirmationController({template: 'confirmation'});
  });

  describe('#propMap', function () {
    it('returns mapped update ready for submission', function () {
      ConfirmationController.propMap(model).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'arrivalTravel' : 'EK009',
        'arrivalDate' : '2016-10-10',
        'arrivalTime' : '19:45',
        'departureForUKDate' : '2016-10-10',
        'departureForUKTime' : '10:35',
        'departureForUKDateOffset': '+04:00',
        'flightDetailsCheck': 'Yes',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'portOfArrival' : 'London - Gatwick',
        'portOfArrivalCode' : 'LGW',
        'inwardDepartureCountry': 'ARE',
        'inwardDeparturePort': 'Dubai',
        'inwardDeparturePortCode': 'DXB',
        'haveDepartureFromUkDetailsChanged': 'Yes',
        'knowDepartureDetails': 'Yes',
        'departureDate': '2017-01-30',
        'departureTravel': 'FL1001',
        'portOfDeparture': 'London - Gatwick'
      });
    });

    it('returns mapped update when return journey is changed but is unknown', function() {
      model['know-departure-details'] = 'No';
      ConfirmationController.propMap(model).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'arrivalTravel' : 'EK009',
        'arrivalDate' : '2016-10-10',
        'arrivalTime' : '19:45',
        'departureForUKDate' : '2016-10-10',
        'departureForUKTime' : '01:01',
        'flightDetailsCheck': 'Yes',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'portOfArrival' : 'London - Gatwick',
        'portOfArrivalCode' : 'LGW',
        'inwardDepartureCountry': 'ARE',
        'inwardDeparturePort': 'Dubai',
        'inwardDeparturePortCode': 'DXB',
        'haveDepartureFromUkDetailsChanged': 'Yes',
        'knowDepartureDetails': 'No',
        'ukDuration': '1 to 3 months'
      });
    });

    it('returns mapped update when return journey not changed', function() {
      model['travel-details-changed'] = 'No';
      ConfirmationController.propMap(model).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'arrivalTravel' : 'EK009',
        'arrivalDate' : '2016-10-10',
        'arrivalTime' : '19:45',
        'departureForUKDate' : '2016-10-10',
        'departureForUKTime' : '01:01',
        'flightDetailsCheck': 'Yes',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'portOfArrival' : 'London - Gatwick',
        'portOfArrivalCode' : 'LGW',
        'inwardDepartureCountry': 'ARE',
        'inwardDeparturePort': 'Dubai',
        'inwardDeparturePortCode': 'DXB',
        'haveDepartureFromUkDetailsChanged': 'No'
      });
    });
  });

  describe('#getValues', function() {
    let req;
    let res;
    let callback;

    beforeEach(function() {
      req = {
        sessionModel: {
          attributes: modelFixture,
          reset: sinon.stub()
        }
      };
      res = {};
      callback = sinon.spy();
      sinon.spy(ConfirmationController, 'propMap');
    });

    describe('successful', function() {
      beforeEach(function() {
        controller.getValues(req, res, callback);
      });

      it('calls propMap to transformData', function() {
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(modelFixture);
      });

      it('calls schema validate', function() {
        validateStub.should.have.been.calledOnce;
      });

      it('calls request post', function() {
        mockRequest.post.should.have.been.calledOnce;
      });

      it('sets details in request', function() {
        req.context.should.deep.equal({
          updateNumber: '123ABC',
          emailAddress: 'test@example.com'
        });
      });

      it('calls session reset', function() {
        req.sessionModel.reset.should.have.been.calledOnce;
      });

      it('calls callback with no params', function() {
        callback.should.have.been.calledOnce.calledWith();
      });
    });

    describe('failed schema validation', function() {
      beforeEach(function() {
        validateStub.returns({valid: false});
        controller.getValues(req, res, callback);
      });

      it('calls propMap to transformData', function() {
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(modelFixture);
      });

      it('calls schema validate', function() {
        validateStub.should.have.been.calledOnce;
      });

      it('calls callback with error', function() {
        callback.should.have.been.calledOnce.calledWith({ valid: false });
      });

      it('does not call request post', function() {
        mockRequest.post.should.not.have.been.called;
      });
    });

    describe('failed request, error returned', function() {
      beforeEach(function() {
        mockRequest.post.yields({error: 'request error'}, null, null);
        controller.getValues(req, res, callback);
      });

      it('calls propMap to transformData', function() {
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(modelFixture);
      });

      it('calls schema validate', function() {
        validateStub.should.have.been.calledOnce;
      });

      it('calls request post', function() {
        mockRequest.post.should.have.been.calledOnce;
      });

      it('calls callback with error', function() {
        callback.should.have.been.calledOnce.calledWith({error: 'request error'});
      });
    });

    describe('failed request, error returned in body', function() {
      beforeEach(function() {
        mockRequest.post.yields(null, null, {error: 'request error'});
        controller.getValues(req, res, callback);
      });

      it('calls propMap to transformData', function() {
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(modelFixture);
      });

      it('calls schema validate', function() {
        validateStub.should.have.been.calledOnce;
      });

      it('calls request post', function() {
        mockRequest.post.should.have.been.calledOnce;
      });

      it('calls callback with error', function() {
        callback.should.have.been.calledOnce.calledWith('request error');
      });
    });
  });

});
