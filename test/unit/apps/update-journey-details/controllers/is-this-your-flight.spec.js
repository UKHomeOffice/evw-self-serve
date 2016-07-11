'use strict';

const IsThisYourFlightController = require('../../../../../apps/update-journey-details/controllers/is-this-your-flight');
const controller = new IsThisYourFlightController({template: 'is-is-this-your-flight'});
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
const req = {
  sessionModel: {
    get: function (key) {
      return this.attributes[key];
    },
    attributes: {
      flightDetails: flightDetails
    }
  },
  params: {}
};

describe('apps/update-journey-details/controllers/is-this-your-flight', function () {
  it('returns flight details', function () {
    controller.locals(req).flightDetails.should.deep.equal(flightDetails);
  });
});
