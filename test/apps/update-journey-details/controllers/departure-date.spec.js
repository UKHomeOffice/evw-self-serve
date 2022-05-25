'use strict';

const moment = require('moment');
const proxyquire = require('proxyquire').noCallThru().noPreserveCache();
const EvwBaseController = require('../../../../apps/common/controllers/evw-base');
const flightLookup = require('evw-ffs');
const sampleFlight = {
  flightNumber: 'EK 009',
  departure: {
    country: 'AE',
    port: 'DXB',
    timezone: 'Asia/Dubai',
    date: '2017-02-28',
    time: '14:35'
  },
  arrival: {
    country: 'GBR',
    port: 'LGW',
    timezone: 'Europe/London',
    date: '2017-02-28',
    time: '18:25'
  }
};

describe('apps/update-journey-details/controllers/departure-date', function() {
  let DepartureDateController;
  let flightLookupMock;
  let controller;
  let req;
  let res;
  let callback;
  let flightDetails = {
    arrivalDateRaw: moment().add(5, 'days').format('YYYY-MM-DD'),
    arrivalTime: '18:25',
    arrivalTimezone: 'Europe/London',
    departureDateRaw: moment().add(5, 'days').format('YYYY-MM-DD'),
    departureTime: '14:35',
    departureTimezone: 'Asia/Dubai'
  };

  beforeEach(function() {
    req = {
      sessionModel: {
        get: sinon.stub(),
        set: sinon.spy()
      },
      form: {
        values: {
          'departure-date-day': '21',
          'departure-date-month': '01',
          'departure-date-year': '2017'
        }
      }
    };
    res = {};
    callback = sinon.spy();
    flightLookupMock = {
      formatPost: sinon.stub().returns({
        number: 'FN1001',
        date: moment('2017-01-21')
      }),
      findFlight: sinon.stub(),
      mapFlight: sinon.stub().returns('mapped flight details'),
      momentDate: flightLookup.momentDate
    };
    DepartureDateController = proxyquire('../../../../apps/update-journey-details/controllers/departure-date', {
      'evw-ffs': flightLookupMock
    });
    controller = new DepartureDateController({template: 'departure-date'});
    req.sessionModel.get.withArgs('flight-number').returns('FN1001');
    req.sessionModel.get.withArgs('flightDetails').returns(flightDetails);
  });

  describe('#process', function() {
    let processStub;
    let lookupStub;

    beforeEach(function() {
      processStub = sinon.stub(EvwBaseController.prototype, 'process');
      processStub.yields();
      lookupStub = sinon.stub(DepartureDateController.prototype, 'lookup');
      controller.process(req, res, callback);
    });

    afterEach(function() {
      processStub.restore();
      lookupStub.restore();
    });

    it('calls parent process', function() {
      processStub.should.have.been.calledOnce.calledWith(req, res);
    });

    it('calls lookup', function() {
      lookupStub.should.have.been.calledOnce.calledWith(req, res, callback);
    });
  });

  describe('#lookup', function() {
    describe('setup', function() {
      beforeEach(function() {
        flightLookupMock.findFlight.resolves();
        controller.lookup(req, res, callback);
      });

      it('calls formatPost', function() {
        flightLookupMock.formatPost.should.have.been.calledOnce.calledWith({
          departureDateDay: '21',
          departureDateMonth: '01',
          departureDateYear: '2017',
          flightNumber: 'FN1001'
        });
      });

      it('calls findFlight', function() {
        flightLookupMock.findFlight.should.have.been.calledOnce.calledWith('FN1001', moment('2017-01-21'));
      });
    });

    describe('finds flight', function() {
      beforeEach(function() {
        flightLookupMock.findFlight.resolves({
          body: {
            flights: [sampleFlight]
          }
        });
        return controller.lookup(req, res, callback);
      });

      it('calls mapFlight', function() {
        flightLookupMock.mapFlight.should.have.been.calledWith(sampleFlight);
      });

      it('sets mapped flight on the session', function() {
        req.sessionModel.set.should.have.been.calledWith('flightDetails', 'mapped flight details');
      });

      it('calls the callback', function() {
        callback.should.have.been.calledOnce;
      });
    });

    describe('finds domestic flight', function() {
      const flightData = {
        flights: [
          {
            flightNumber: 'BA2135',
            departure: {
              country: 'GBR',
              port: 'LHR',
              timezone: 'Europe/London',
              date: '2016-09-21',
              time: '15:10'
            },
            arrival: {
              country: 'GBR',
              port: 'BHD',
              timezone: 'Europe/London',
              date: '2016-08-09',
              time: '16:30'
            }
          }
        ]
      };

      beforeEach(function() {
        flightLookupMock.findFlight.resolves({
          body: {
            flights: [flightData]
          }
        });
        return controller.lookup(req, res, callback);
      });

      it('sets flightDetails to null in session', function () {
        req.sessionModel.set.should.have.been.calledWith('flightDetails', null);
      });

      it('calls the callback', function() {
        callback.should.have.been.calledOnce;
      });
    });

    describe('flight service returns nothing', function() {
      beforeEach(function() {
        flightLookupMock.findFlight.resolves({
          body: undefined
        });
        return controller.lookup(req, res, callback);
      });

      it('does not attempt mapFlight', function() {
        flightLookupMock.mapFlight.should.not.have.been.called;
      });

      it('sets flight details to null on the session', function() {
        req.sessionModel.set.should.have.been.calledWith('flightDetails', null);
      });

      it('calls the callback', function() {
        callback.should.have.been.calledOnce;
      });
    });

    describe('flight service errors', function() {
      beforeEach(function() {
        flightLookupMock.findFlight.rejects();
        return controller.lookup(req, res, callback);
      });

      it('sets flight details to null on the session', function() {
        req.sessionModel.set.should.have.been.calledWith('flightDetails', null);
      });

      it('calls the callback', function() {
        callback.should.have.been.calledOnce;
      });
    });
  });

  describe('#getTravelDates', function() {
    it('returns an object', function() {
      controller.getTravelDates(req).should.be.an.object;
    });

    it('returns arrival date moment', function() {
      controller.getTravelDates(req).arrival.should.contain.property('_isAMomentObject', true);
    });

    it('returns departure date moment', function() {
      controller.getTravelDates(req).departure.should.contain.property('_isAMomentObject', true);
    });

    describe('flight service', function() {
      let dates;


      beforeEach(function() {
        flightDetails.departureDateRaw = '2017-01-21';
        flightDetails.arrivalDateRaw = '2017-01-21';
        dates = controller.getTravelDates(req);
      });

      it('should get the data from the flight details on the session', function() {
        req.sessionModel.get.should.have.calledWith('flightDetails');
      });

      it('returns the correct departure and arrival dates', function() {
        dates.departure.format('DD-MM-YYYY HH:mm').should.equal('21-01-2017 10:35');
        dates.arrival.format('DD-MM-YYYY HH:mm').should.equal('21-01-2017 18:25');
      });
    });
  });

  describe('#locals', function() {
    let locals;

    beforeEach(function() {
      EvwBaseController.prototype.locals = sinon.stub().returns({
        prop: 'value'
      });
      locals = controller.locals(req, res);
    });

    afterEach(function() {
      delete EvwBaseController.prototype.locals;
    });

    it('calls parent locals', function() {
      EvwBaseController.prototype.locals.should.have.been.calledOnce.calledWith(req, res);
    });

    it('adds flight number to locals', function() {
      locals.should.have.property('flightNumber', 'FN1001');
    });

    it('maintains locals from parent', function() {
      locals.should.have.property('prop', 'value');
    });
  });

});
