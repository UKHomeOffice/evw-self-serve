'use strict';

const moment = require('moment');
let ConfirmationController = require('../../../../apps/update-journey-details/controllers/confirmation');
let propMap = ConfirmationController.propMap;
let modelFixture = require('../../../fixtures/update-model');

describe('apps/update-journey-details/controllers/confirmation', function () {
  let model;

  beforeEach(function() {
    model = Object.assign({}, modelFixture);
  });

  describe('#propMap', function () {
    it('returns mapped update ready for submission', function () {
      propMap(model).should.deep.equal({
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
        'knowDepartureDetails': 'Yes',
        'departureDate': '2017-01-30',
        'departureTravel': 'FL1001',
        'portOfDeparture': 'London - Gatwick'
      });
    });

    it('returns mapped update when return journey is changed but is unknown', function() {
      model['know-departure-details'] = 'No';
      propMap(model).should.deep.equal({
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
      propMap(model).should.deep.equal({
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

});
