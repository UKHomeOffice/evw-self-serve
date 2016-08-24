'use strict';

const path = require('path');
let flightLookup = require('../../lib/flight-lookup');
let airports = require('../../data/airports');
let chaiAsPromised = require('chai-as-promised');
let config = require('../../config');
chai.use(chaiAsPromised);

describe('lib/flight-lookup', function() {

    before(function (done) {
        let port = config.flightService.url.split(':').pop();
        let dir = path.resolve(__dirname, '../../mocks');
        this.dyson = dysonServer({
          mocks: dir,
          port: port,
          name: 'flight lookup service'
        }, done);
    });

    after(function () {
      this.dyson.kill();
    });

    describe('#findFlight', function() {
        it('returns a 200 status code', function() {
            let foundData = flightLookup.findFlight('KU0101', '2016-08-09');
            return foundData.should.eventually.deep.have.property('statusCode', 200);
        });

        it('returns a valid flight object', function() {
            let foundData = flightLookup.findFlight('KU0101', '2016-08-09');
            return foundData.should.eventually.deep.have.property('body.flights[0]').to.equal({
                flightNumber: 'KU0101',
                departures: [{
                    country: 'AE',
                    port: 'DXB'
                }],
                arrival: {
                    port: 'LGW',
                    date: '2016-08-09',
                    time: '1845'
                },
                params: {},
                query: {},
                body: {
                    arrivalDate: '2016-08-09',
                    flightNumber: 'KU0101'
                }
            });
        });
    });

    describe('#formatFlightNumber', function() {
        it('formats the flight number into the correct format for sending to the api', function() {
            flightLookup.formatFlightNumber('ku101').should.equal('KU0101');
        });
    });

    describe('#formatPost', function() {
        it('formats the data into the correct format for sending to the api', function() {
            let body = {
                flightNumber: 'ku101',
                arrivalDateDay: '09',
                arrivalDateMonth: '08',
                arrivalDateYear: '2016'
            };
            flightLookup.formatPost(body).should.deep.equal({
                number: 'KU0101',
                date: '2016-08-09'
            });
        });
    });

    describe('departures', function () {

        let flightData;

        before(function (done) {
            flightLookup.findFlight('KU0101', '2016-08-09').then((data) => {
                flightData = data.body.flights[0];
                done();
            });
        });

        describe('#mapDepartures', function () {
            describe('single result', function () {
                it('maps a list of departures', function () {
                    flightLookup.mapDepartures(flightData.departures)
                    .should.deep.equal([
                        {
                            inwardDepartureCountryPlane: 'United Arab Emirates',
                            inwardDepartureCountryPlaneCode: 'ARE',
                            departureAirport: 'Dubai',
                            inwardDeparturePortPlaneCode: 'DXB'
                        }
                    ]);
                });
            });

            describe('multiple results', function () {
                before(function (done) {
                    flightLookup.findFlight('LEG0001', '2016-08-09').then((data) => {
                        flightData = data.body.flights[0];
                        done();
                    });
                });

                it('maps a list of departures', function () {
                    flightLookup.mapDepartures(flightData.departures)
                    .should.deep.equal([
                        {
                            inwardDepartureCountryPlane: 'United Arab Emirates',
                            inwardDepartureCountryPlaneCode: 'ARE',
                            departureAirport: 'Dubai',
                            inwardDeparturePortPlaneCode: 'DXB'
                        },
                        {
                            inwardDepartureCountryPlane: 'United Arab Emirates',
                            inwardDepartureCountryPlaneCode: 'ARE',
                            departureAirport: 'Abu Dhabi',
                            inwardDeparturePortPlaneCode: 'AUH'
                        }
                    ]);
                });
            });

        });
    });

    describe('#mapFlight', function() {
        let flightData;
        let sessionModel = {
            get: function (key) {
                return this.attributes[key];
            },
            attributes: {
                'flight-number': 'ku101'
            }
        };

        before(function (done) {
            flightLookup.findFlight('KU0101', '2016-08-09').then((data) => {
                flightData = data.body.flights[0];
                done();
            });
        });

        it('formats the data from the api into the correct format to use in the app', function() {
            let flight = flightData;

            flightLookup.mapFlight(flight, sessionModel).should.deep.equal({
                flightNumber: 'ku101',
                departures: [
                    {
                      departureAirport: 'Dubai',
                      inwardDeparturePortPlaneCode: 'DXB',
                      inwardDepartureCountryPlane: 'United Arab Emirates',
                      inwardDepartureCountryPlaneCode: 'ARE'
                    }
                ],
                arrivalAirport: 'London - Gatwick',
                portOfArrivalPlaneCode: 'LGW',
                arrivalDate: '09-08-2016',
                arrivalDatePlaneDay: '09',
                arrivalDatePlaneMonth: '08',
                arrivalDatePlaneYear: '2016',
                arrivalTime: '19:45',
                arrivalTimePlaneHour: '19',
                arrivalTimePlaneMinutes: '45',
                aliasFlightNumber: undefined
            });
        });
    });

    describe('#momentDate', function() {
        let datetime = {
            date: '2016-08-09',
            time: '1345'
        }

        it('returns a moment object', function() {
            flightLookup.momentDate(datetime).should.contain.property('_isAMomentObject', true);
        });

        it('returns a valid date', function() {
            flightLookup.momentDate(datetime).should.contain.property('_isValid', true);
        });

        it('returns the correct date', function() {
            flightLookup.momentDate(datetime).should.contain.property('_i', '2016-08-09 1345');
        });
    });

    describe('#search', function() {
        describe('when searching a data file', function() {
            it('returns an object if the value is found', function() {
                let pair = {
                    key: 'code',
                    val: 'KWI'
                };
                flightLookup.search(airports, pair).should.deep.equal({
                    type: 'plane',
                    country: 'Kuwait',
                    'country-code': 'KWT',
                    code: 'KWI',
                    name: 'Kuwait - Kuwait Intl'
                });
            });

            it("returns false if the value isn't found", function() {
                let pair = {
                    key: 'code',
                    val: 'kwi'
                };
                flightLookup.search(airports, pair).should.be.false;
            });
        })
    });

    describe('#country', function() {
        describe('when searching the countries data file', function() {
            it('returns a country object if the country is found', function() {
                flightLookup.country('KWT').should.equal('Kuwait');
            });

            it("returns false if the country isn't found", function() {
                flightLookup.country('kwt').should.be.false;
            });
        });
    });

    describe('#airport', function() {
        describe('when searching the airports data file', function() {
            it('returns an airport object if the airport is found', function() {
                flightLookup.airport('DXB').should.equal('Dubai');
            });

            it("returns false if the airport isn't found", function() {
                flightLookup.airport('dxb').should.be.false;
            });
        });
    });
});
