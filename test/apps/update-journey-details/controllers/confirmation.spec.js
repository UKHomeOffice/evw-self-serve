'use strict';

const moment = require('moment');
const everythingFixture = require('../../../fixtures/everything');
const arrivalAndDepartureFlightFixture = require('../../../fixtures/update-model');
const arrivalFlightAndTripDurationFixture = require('../../../fixtures/arrival-flight-and-trip-duration');
const arrivalAndAccommodationFixture = require('../../../fixtures/arrival-and-accommodation');
const departureFlightAndAccommodationFixture = require('../../../fixtures/departure-and-accommodation');
const arrivalFlightOnlyFixture = require('../../../fixtures/arrival-flight-only');
const departureFlightOnlyFixture = require('../../../fixtures/departure-flight-only');
const tripDurationOnlyFixture = require('../../../fixtures/trip-duration-only');
const accommodationOnlyFixture = require('../../../fixtures/accommodation-only');
const proxyquire = require('proxyquire');
const is = require('../../../../config').integrationService;

describe('apps/update-journey-details/controllers/confirmation', function () {
  let ConfirmationController;
  let controller;
  let mockRequest;
  let mockJsonSchema;
  let validateStub;

  beforeEach(function() {
    mockRequest = {
      post: sinon.stub().yields(null, null, {
        membershipNumber: '123ABC',
        emailAddress: 'test@example.com'
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
    it('returns mapped update when arrival flight, departure flight, and accommodation details are supplied', function () {
      let everything = Object.assign({}, everythingFixture);

      ConfirmationController.propMap(everything).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'arrival': {
          'arrivalTravel' : 'EK009',
          'arrivalDate' : '2016-10-10',
          'arrivalTime' : '19:45',
          'departureForUKDate' : '2016-10-10',
          'departureForUKTime' : '14:35',
          'portOfArrival' : 'London Gatwick Airport',
          'portOfArrivalCode' : 'LGW',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai Airport',
          'inwardDeparturePortCode': 'DXB',
          'flightDetailsCheck': 'Yes',
          'travelBy': 'Plane'
        },
        'departure': {
          'knowDepartureDetails': 'Yes',
          'departureDate': '2017-01-30',
          'departureTravel': 'FL1001',
          'portOfDeparture': 'London Gatwick Airport'
        },
        'accommodation': {
          'ukAddress': [
            '123 Lane Street',
            'Avenue Road',
            'Bromley',
            'West Surrey',
            'CR1 9ZQ'
          ],
          'ukVisitPhoneNumber': '447707070707'
        }
      });
    });

    it('returns mapped update when arrival flight and departure flight details are supplied', function () {
      let arrivalAndDepartureFlight = Object.assign({}, arrivalAndDepartureFlightFixture);

      ConfirmationController.propMap(arrivalAndDepartureFlight).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'arrival': {
          'arrivalTravel' : 'EK009',
          'arrivalDate' : '2016-10-10',
          'arrivalTime' : '19:45',
          'departureForUKDate' : '2016-10-10',
          'departureForUKTime' : '14:35',
          'portOfArrival' : 'London Gatwick Airport',
          'portOfArrivalCode' : 'LGW',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai Airport',
          'inwardDeparturePortCode': 'DXB',
          'flightDetailsCheck': 'Yes',
          'travelBy': 'Plane'
        },
        'departure': {
          'knowDepartureDetails': 'Yes',
          'departureDate': '2017-01-30',
          'departureTravel': 'FL1001',
          'portOfDeparture': 'London Gatwick Airport'
        }
      });
    });

    it('returns mapped update when arrival flight and trip duration details are supplied', function() {
      let arrivalFlightAndTripDuration = Object.assign({}, arrivalFlightAndTripDurationFixture);

      ConfirmationController.propMap(arrivalFlightAndTripDuration).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'arrival': {
          'arrivalTravel' : 'EK009',
          'arrivalDate' : '2016-10-10',
          'arrivalTime' : '19:45',
          'departureForUKDate' : '2016-10-10',
          'departureForUKTime' : '14:35',
          'portOfArrival' : 'London Gatwick Airport',
          'portOfArrivalCode' : 'LGW',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai Airport',
          'inwardDeparturePortCode': 'DXB',
          'flightDetailsCheck': 'Yes',
          'travelBy': 'Plane'
        },
        'departure': {
          'knowDepartureDetails': 'No',
          'ukDuration': '1 to 3 months'
        }
      });
    });

    it('returns mapped update when arrival flight and accommodation details are supplied', function () {
      let arrivalAndAccommodation = Object.assign({}, arrivalAndAccommodationFixture);

      ConfirmationController.propMap(arrivalAndAccommodation).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'arrival': {
          'arrivalTravel' : 'EK009',
          'arrivalDate' : '2016-10-10',
          'arrivalTime' : '19:45',
          'departureForUKDate' : '2016-10-10',
          'departureForUKTime' : '14:35',
          'portOfArrival' : 'London Gatwick Airport',
          'portOfArrivalCode' : 'LGW',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai Airport',
          'inwardDeparturePortCode': 'DXB',
          'flightDetailsCheck': 'Yes',
          'travelBy': 'Plane'
        },
        'accommodation': {
          'ukAddress': [
            '123 Lane Street',
            'Avenue Road',
            'Bromley',
            'West Surrey',
            'CR1 9ZQ'
          ],
          'ukVisitPhoneNumber': '447707070707'
        }
      });
    });

    it('returns mapped update when departure flight and accommodation details are supplied', function () {
      let departureFlightAndAccommodation = Object.assign({}, departureFlightAndAccommodationFixture);

      ConfirmationController.propMap(departureFlightAndAccommodation).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'departure': {
          'knowDepartureDetails': 'Yes',
          'departureDate': '2017-01-30',
          'departureTravel': 'FL1001',
          'portOfDeparture': 'London Gatwick Airport'
        },
        'accommodation': {
          'ukAddress': [
            '123 Lane Street',
            'Avenue Road',
            'Bromley',
            'West Surrey',
            'CR1 9ZQ'
          ],
          'ukVisitPhoneNumber': '447707070707'
        }
      });
    });

    it('returns mapped update when only arrival flight details are supplied', function() {
      let arrivalFlightOnly = Object.assign({}, arrivalFlightOnlyFixture);

      ConfirmationController.propMap(arrivalFlightOnly).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'arrival': {
          'arrivalTravel' : 'EK009',
          'arrivalDate' : '2016-10-10',
          'arrivalTime' : '19:45',
          'departureForUKDate' : '2016-10-10',
          'departureForUKTime' : '14:35',
          'portOfArrival' : 'London Gatwick Airport',
          'portOfArrivalCode' : 'LGW',
          'inwardDepartureCountry': 'ARE',
          'inwardDeparturePort': 'Dubai Airport',
          'inwardDeparturePortCode': 'DXB',
          'flightDetailsCheck': 'Yes',
          'travelBy': 'Plane'
        }
      });
    });

    it('returns mapped update when only departure flight details are supplied', function() {
      let departureFlightOnly = Object.assign({}, departureFlightOnlyFixture);

      ConfirmationController.propMap(departureFlightOnly).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'departure': {
          'knowDepartureDetails': 'Yes',
          'departureDate': '2017-01-30',
          'departureTravel': 'FL1001',
          'portOfDeparture': 'London Gatwick Airport',
        }
      });
    });

    it('returns mapped update when only trip duration details are supplied', function() {
      let tripDurationOnly = Object.assign({}, tripDurationOnlyFixture);

      ConfirmationController.propMap(tripDurationOnly).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'departure': {
          'knowDepartureDetails': 'No',
          'ukDuration': '1 to 3 months'
        }
      });
    });

    it('returns mapped update when only accommodation details are supplied', function() {
      let accommodationOnly = Object.assign({}, accommodationOnlyFixture);

      ConfirmationController.propMap(accommodationOnly).should.deep.equal({
        'membershipNumber' : 'ABC1234',
        'token' : 'token123',
        'dateCreated': moment().format('YYYY-MM-DD hh:mm:ss'),
        'accommodation': {
          'ukAddress': [
            '123 Lane Street',
            'Avenue Road',
            'Bromley',
            'West Surrey',
            'CR1 9ZQ'
          ],
          'ukVisitPhoneNumber': '447707070707'
        }
      });
    });

  });

  describe('#getValues', function() {
    let req;
    let res;
    let callback;
    let model;

    beforeEach(function() {
      model = Object.assign({}, arrivalAndDepartureFlightFixture);
      req = {
        sessionModel: {
          attributes: model,
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
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(model);
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
          emailAddress: 'test@example.com',
          didUpdateToUK: true
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
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(model);
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
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(model);
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
        ConfirmationController.propMap.should.have.been.calledOnce.calledWith(model);
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
