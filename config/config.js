'use strict';

module.exports = {
    flightService: {
        url: process.env.FLIGHT_SERVICE_URL || 'http://localhost:9350',
        timeout: 5000,
        check: {
            method: 'POST',
            endpoint: 'check-flight-details'
        }
    }
};
