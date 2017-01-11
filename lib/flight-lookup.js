'use strict';

const request = require('request');
const service = require('../config').flightService;
const moment = require('moment');
require('moment-timezone');
const countries = require('../data/nationalities.json');
const airports = require('../data/airports.json');
const logger = require('../lib/logger');

module.exports = {
    findFlight: function(num, date) {
        var method = service.check.method.toLowerCase();
        /* eslint-disable max-len */
        const url = `${service.url}/${service.check.endpoint}?flightNumber=${num}&departureDate=${date}&arrivalCountryCode=GBR`;
        /* eslint-enable max-len */

        return new Promise((resolve, reject) => {
            request[method]({
                url: url,
                json: true,
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
    // BA09 => BA09
    // BAX-2094 => BAX2094
    formatFlightNumber: function(num) {
        // Remove white space and other symbols
        return num.replace(/[^A-Z0-9]/ig, '');
    },
    formatPost: function(body) {
        return {
            // sanitise user input
            number: this.formatFlightNumber(body.flightNumber),
            date: moment([
                body.departureDateDay,
                body.departureDateMonth,
                body.departureDateYear
            ].reverse().join('-'), 'YYYY-M-D').format('YYYY-MM-DD')
        };
    },

    // map service response to useful form elements
    mapFlight: function(flight, sessionModel) {
        let departCode = (departure) => this.search(airports, {
            key: 'code',
            val: departure.port
        })['country-code'];
        const departureDate = this.momentDate(flight.departure);
        const arrivalDate = this.momentDate(flight.arrival);

        return {
            flightNumber: sessionModel.get('flight-number').toUpperCase(),
            inwardDepartureCountryPlane: this.country(departCode(flight.departure)),
            inwardDepartureCountryPlaneCode: departCode(flight.departure),
            departureAirport: this.airport(flight.departure.port),
            inwardDeparturePortPlaneCode: flight.departure.port,
            departureDateRaw: flight.departure.date,
            departureTimezone: flight.departure.timezone,
            departureDate: departureDate.format('DD/MM/YYYY'),
            departureDatePlaneDay: departureDate.format('DD'),
            departureDatePlaneMonth: departureDate.format('MM'),
            departureDatePlaneYear: departureDate.format('YYYY'),
            departureTime: departureDate.format('HH:mm'),
            departureTimePlaneHour: departureDate.format('HH'),
            departureTimePlaneMinutes: departureDate.format('mm'),
            arrivalAirport: this.airport(flight.arrival.port),
            portOfArrivalPlaneCode: flight.arrival.port,
            arrivalDateRaw: flight.arrival.date,
            arrivalTimezone: flight.arrival.timezone,
            arrivalDate: arrivalDate.format('DD/MM/YYYY'),
            arrivalDatePlaneDay: arrivalDate.format('DD'),
            arrivalDatePlaneMonth: arrivalDate.format('MM'),
            arrivalDatePlaneYear: arrivalDate.format('YYYY'),
            arrivalTime: arrivalDate.format('HH:mm'),
            arrivalTimePlaneHour: arrivalDate.format('HH'),
            arrivalTimePlaneMinutes: arrivalDate.format('mm')
        };
    },
    momentDate: function(datetime) {
        return moment.tz(`${datetime.date} ${datetime.time}`, datetime.timezone);
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
