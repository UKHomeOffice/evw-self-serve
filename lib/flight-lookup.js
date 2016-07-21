const request = require('request');
const service = require('../config').flightService;
const moment = require('moment');
const momentTimezone = require('moment-timezone');
const countries = require('../data/nationalities.json');
const airports = require('../data/airports.json');
const logger = require('../lib/logger');

module.exports = {
    findFlight: function(num, date) {
        var method = service.check.method.toLowerCase();

        return new Promise((resolve, reject) => {
            request[method]({
                url: `${service.url}/${service.check.endpoint}`,
                json: { flightNumber: num, arrivalDate: date },
                timeout: service.timeout
            }, function (err, response) {
                if (err) {
                    logger.error(err);
                    reject(err);
                } else {
                    resolve(response);
                }
            });
        });
    },
    // BA 1000 => BA1000
    // BA09 => BA0009
    // BAX-2094 => BAX2094
    formatFlightNumber: function(num) {
        // Remove white space and other symbols
        var flightNo = num.replace(/[^A-Z0-9]/ig, '');

        // get first instance of number
        var match = flightNo.match(/\d+/);
        var cut = match ? match.index : false;

        if (!cut) {
            return flightNo;
        }

        var carrierCode = flightNo.substring(0, cut).toUpperCase();
        var number = flightNo.substring(cut);

        // Pad the numbers with missing zeros if required
        if (number.length < 4) {
            number = ('0000' + number).slice(-4);
        }

        return carrierCode + number;
    },
    formatPost: function(body) {
        return {
            // sanitise user input
            number: this.formatFlightNumber(body.flightNumber),
            date: moment([
                body.arrivalDateDay,
                body.arrivalDateMonth,
                body.arrivalDateYear
            ].reverse().join('-'), 'YYYY-M-D').format('YYYY-MM-DD')
        };
    },
    // map service response to useful form elements
    mapFlight: function(flight, sessionModel) {
        var arrivalDate = this.momentDate(flight.arrival);
        var departCode = this.search(airports, {
            key: 'code',
            val: flight.departure.port
        })['country-code'];

        return {
            flightNumber: sessionModel.get('flight-number'),
            inwardDepartureCountryPlane: this.country(departCode),
            inwardDepartureCountryPlaneCode: departCode,
            departureAirport: this.airport(flight.departure.port),
            inwardDeparturePortPlaneCode: flight.departure.port,
            arrivalAirport: this.airport(flight.arrival.port),
            portOfArrivalPlaneCode: flight.arrival.port,
            arrivalDate: `${arrivalDate.format('DD')}-${arrivalDate.format('MM')}-${arrivalDate.format('YYYY')}`,
            arrivalDatePlaneDay: arrivalDate.format('DD'),
            arrivalDatePlaneMonth: arrivalDate.format('MM'),
            arrivalDatePlaneYear: arrivalDate.format('YYYY'),
            arrivalTime: `${arrivalDate.format('HH')}:${arrivalDate.format('mm')}`,
            arrivalTimePlaneHour: arrivalDate.format('HH'),
            arrivalTimePlaneMinutes: arrivalDate.format('mm'),
            aliasFlightNumber: flight.aliasFlightNumber
        };
    },
    momentDate: function(datetime) {
      return momentTimezone.utc(`${datetime.date} ${datetime.time}`, 'YYYY-MM-DD HHmm').tz('Europe/London');
    },
    // Get an item from source json using a key
    // search(countries, {key: 'code',val: 'ARE'})
    search: (source, pair) => {
      return source.find(obj => obj[pair.key] === pair.val) || false;
    },
    country: (code) => {
      return (countries.find(obj => obj.code === code) || {}).name || false;
    },
    // DXB => Dubai and then derive country name from ARE
    airport: (code) => {
      return (airports.find(obj => obj.code === code) || {}).name || false;
    }
};
