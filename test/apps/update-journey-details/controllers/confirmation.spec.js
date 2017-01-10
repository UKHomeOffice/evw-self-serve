'use strict';

const moment = require('moment');
let ConfirmationController = require('../../../../apps/update-journey-details/controllers/confirmation');
let propMap = ConfirmationController.propMap;
let modelFixture = require('../../../fixtures/update-model');

describe('apps/update-journey-details/controllers/confirmation', function () {

  describe('#propMap', function () {
    it('returns mapped update ready for submission', function () {
      propMap(modelFixture).should.deep.equal({
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
        'inwardDeparturePortCode': 'DXB'
      });
    });
  });

});
