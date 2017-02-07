'use strict';

const IsThisYourFlightController = require('../../../../apps/update-journey-details/controllers/is-this-your-flight');
const controller = new IsThisYourFlightController({template: 'is-is-this-your-flight'});
const EvwBaseController = require('../../../../apps/common/controllers/evw-base');

const flightDetails = {
  flightNumber: 'KU101',
  inwardDepartureCountryPlane: 'United Arab Emirates',
  inwardDepartureCountryPlaneCode: 'ARE',
  departureAirport: 'Dubai',
  inwardDeparturePortPlaneCode: 'DXB',
  arrivalAirport: 'London - Gatwick',
  portOfArrivalPlaneCode: 'LGW',
  arrivalDate: '09/08/2016',
  arrivalDatePlaneDay: '09',
  arrivalDatePlaneMonth: '08',
  arrivalDatePlaneYear: '2016',
  arrivalTime: '19:45',
  arrivalTimePlaneHour: '19',
  arrivalTimePlaneMinutes: '45'
};

describe('apps/update-journey-details/controllers/is-this-your-flight', function () {
  let req;
  let res;
  let callback;

  beforeEach(function() {
    req = {
      sessionModel: {
        get: sinon.stub().returns(flightDetails),
        attributes: {
          flightDetails: flightDetails
        }
      },
      params: {}
    };
    res = {
      redirect: sinon.spy()
    };
    callback = sinon.spy();
  });

  describe('#locals', function() {
    it('returns flight details', function () {
      controller.locals(req).flightDetails.should.deep.equal(flightDetails);
    });
  });

  describe('#getValues', function() {
    let getValuesStub;

    beforeEach(function() {
      getValuesStub = sinon.stub(EvwBaseController.prototype, 'getValues');
      getValuesStub.yields();
    });

    afterEach(function() {
      getValuesStub.restore();
    });

    it('redirects to flight-number if flight details are not set', function () {
      req.sessionModel.get.returns(null);
      controller.getValues(req, res, callback);
      res.redirect.should.have.been.calledOnce.calledWith('flight-number');
    });

    it('continues as normal if flight details are present', function() {
      controller.getValues(req, res, callback);
      getValuesStub.should.have.been.calledOnce.calledWith(req, res, callback);
    });
  });

});
