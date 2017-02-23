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
                departure: {
                    country: 'AE',
                    port: 'DXB',
                    timezone: 'Asia/Dubai',
                    date: '2016-08-09',
                    time: '14:35'
                },
                arrival: {
                    country: 'GBR',
                    port: 'LGW',
                    timezone: 'Europe/London',
                    date: '2016-08-09',
                    time: '18:25'
                }
            });
        });
    });

    describe('#formatFlightNumber', function() {
        it('formats the flight number into the correct format for sending to the api', function() {
            flightLookup.formatFlightNumber('ku 101').should.equal('ku101');
        });
    });

    describe('#formatPost', function() {
        it('formats the data into the correct format for sending to the api', function() {
            let body = {
                flightNumber: 'ku101',
                departureDateDay: '09',
                departureDateMonth: '08',
                departureDateYear: '2016'
            };
            flightLookup.formatPost(body).should.deep.equal({
                number: 'ku101',
                date: '2016-08-09'
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

        before(function () {
            return flightLookup.findFlight('KU0101', '2016-08-09').then((data) => {
                flightData = data.body.flights[0];
            });
        });

        it('formats the data from the api into the correct format to use in the app', function() {
            let flight = flightData;

            flightLookup.mapFlight(flight, sessionModel).should.deep.equal({
                flightNumber: 'KU101',
                departureDate: '09/08/2016',
                departureDatePlaneDay: '09',
                departureDatePlaneMonth: '08',
                departureDatePlaneYear: '2016',
                departureDateRaw: '2016-08-09',
                departureTime: '14:35',
                departureTimePlaneHour: '14',
                departureTimePlaneMinutes: '35',
                departureTimezone: 'Asia/Dubai',
                arrivalAirport: 'London Gatwick Airport',
                portOfArrivalPlaneCode: 'LGW',
                arrivalTimezone: 'Europe/London',
                arrivalDateRaw: '2016-08-09',
                arrivalDate: '09/08/2016',
                arrivalDatePlaneDay: '09',
                arrivalDatePlaneMonth: '08',
                arrivalDatePlaneYear: '2016',
                arrivalTime: '18:25',
                arrivalTimePlaneHour: '18',
                arrivalTimePlaneMinutes: '25',
                departureAirport: 'Dubai Airport',
                inwardDeparturePortPlaneCode: 'DXB',
                inwardDepartureCountryPlane: 'United Arab Emirates',
                inwardDepartureCountryPlaneCode: 'ARE'
            });
        });
    });

    describe('#momentDate', function() {
        let datetime = {
            date: '2016-08-09',
            time: '13:45',
            timezone: 'Europe/London'
        };

        it('returns a moment object', function() {
            flightLookup.momentDate(datetime).should.contain.property('_isAMomentObject', true);
        });

        it('returns a valid date', function() {
            flightLookup.momentDate(datetime).should.contain.property('_isValid', true);
        });

        it('returns the correct date', function() {
            flightLookup.momentDate(datetime).should.contain.property('_i', '2016-08-09 13:45');
        });

        it('returns the correct timezone', function() {
            flightLookup.momentDate(datetime)._z.should.contain.property('name', 'Europe/London');
        });

        it('correctly observes a timezone that is not local', function() {
            datetime.timezone = 'Asia/Dubai';
            const date = flightLookup.momentDate(datetime);
            date._z.should.contain.property('name', 'Asia/Dubai');
            date.tz("Europe/London").format('YYYY-MM-DD HH:mm').should.equal('2016-08-09 10:45');
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
                    code: 'KWI',
                    name: 'Kuwait International Airport',
                    countryCode: 'KWT',
                    timezone: 'Asia/Kuwait'
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
                flightLookup.airport('DXB').should.equal('Dubai Airport');
            });

            it("returns false if the airport isn't found", function() {
                flightLookup.airport('dxb').should.be.false;
            });
        });
    });
});
