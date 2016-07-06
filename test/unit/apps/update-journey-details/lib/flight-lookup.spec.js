'use strict';

let flightLookup = require('../../../../../lib/flight-lookup');
let airports = require('../../../../../data/airports');
let dyson = require('dyson');
let chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

describe('lib/flight-lookup', function() {
    describe('#findFlight', function() {
        it('returns a 200 status code', function() {
            let foundData = flightLookup.findFlight('KU0101', '2016-08-09');
            return foundData.should.eventually.deep.have.property('statusCode', 200);
        });

        it('returns a valid flight object', function() {
            let foundData = flightLookup.findFlight('KU0101', '2016-08-09');
            return foundData.should.eventually.deep.have.property('body.flights[0]').to.equal({
                flightNumber: 'KU0101',
                departure: {
                    country: 'AE',
                    port: 'DXB'
                },
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

    describe('#mapFlight', function() {
        it('formats the data from the api into the correct format to use in the app', function() {
            let flight = {
                flightNumber: 'KU0101',
                departure: {
                    country: 'KW', port: 'KWI'
                },
                arrival: {
                    port: 'LHR',
                    date: '2016-08-09',
                    time: '1345'
                }
            };
            let sessionModel = {
                get: function (key) {
                    return this.attributes[key];
                },
                attributes: {
                    'flight-number': 'ku101'
                }
            };
            flightLookup.mapFlight(flight, sessionModel).should.deep.equal({
                flightNumber: 'ku101',
                inwardDepartureCountryPlane: 'Kuwait',
                inwardDepartureCountryPlaneCode: 'KWT',
                departureAirport: 'Kuwait - Kuwait Intl',
                inwardDeparturePortPlaneCode: 'KWI',
                arrivalAirport: 'London - Heathrow',
                portOfArrivalPlaneCode: 'LHR',
                arrivalDate: '09/08/2016',
                arrivalDatePlaneDay: '09',
                arrivalDatePlaneMonth: '08',
                arrivalDatePlaneYear: '2016',
                arrivalTime: '14:45',
                arrivalTimePlaneHour: '14',
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
