'use strict';

const ChooseDepartureAirport = require('../../../../apps/update-journey-details/controllers/choose-departure-airport');
const controller = new ChooseDepartureAirport({template: 'choose-departure-airport'});
const flightDetails = {
  flightNumber: 'LOL10000',
  departures:
  [
    {
      inwardDepartureCountryPlane: 'United Arab Emirates',
      inwardDepartureCountryPlaneCode: 'ARE',
      departureAirport: 'Dubai',
      inwardDeparturePortPlaneCode: 'DXB'
    }, {
      inwardDepartureCountryPlane: 'Oman',
      inwardDepartureCountryPlaneCode: 'OMN',
      departureAirport: 'Muscat - Seeb',
      inwardDeparturePortPlaneCode: 'MCT'
    }
  ]
};
const req = {
  sessionModel: {
    get: function (key) {
      return this.attributes[key];
    },
    set: function (key, value) {
      return this.attributes[key] = value;
    },
    attributes: {
      flightDetails: flightDetails
    }
  },
  form: {
    values: {
      departures: 'DXB'
    }
  },
  params: {}
};

describe('apps/update-journey-details/controllers/choose-departure-airport', function () {

  describe('process', function () {
    it('assigns user choice to sessionModel', function () {
      controller.process(req, null, () => false);
      let flight = req.sessionModel.get('flightDetails');
      flight.should.include.property('departureAirport').equal('Dubai');
      flight.should.include.property('inwardDeparturePortPlaneCode').equal('DXB');
      flight.should.include.property('inwardDepartureCountryPlaneCode').equal('ARE');
      flight.should.include.property('inwardDepartureCountryPlane').equal('United Arab Emirates')
    });
  });

  describe('locals', function () {
    let res;

    before(function () {
       res = {
        locals: {
          options: {
            fields: {
              departures: {}
            }
          }
        }
      };
    });

    it('adds flight number to locals', function () {
      controller.locals(req, res, () => false)
      .should.include.property('flightNumber')
      .equal('LOL10000');
    });

    it('adds a list of departures to render', function () {
      controller.locals(req, res, () => false)
      .departures.options
      .should.deep.equal([
        {
          label: 'Dubai',
          value: 'DXB'
        }, {
          label: 'Muscat - Seeb',
          value: 'MCT'
        }
      ])
    });
  });

});
