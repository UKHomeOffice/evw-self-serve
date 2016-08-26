'use strict';

var tpl = function (params, query, body) {
    return {
        flightNumber: body.flightNumber,
        departures: [{
            port: 'DXB',
            country: 'AE'
        }],
        arrival: {
            port: 'LGW',
            date: body.arrivalDate,
            time: '1845'
        },
        params: params,
        query: query,
        body: body
    };
};

var search = {

    path: '/check-flight-details',

    cache: false,

    status: function(req, res) {
        // mock fail state
        if(req.body.flightNumber === 'FAIL999') {
            res.status(500).send('Service is down');
        } else {
            res.status(200).json({
                flights: this.template.flights(req.params, req.query, req.body)
            });
        }
    },

    template: {
        flights: function (params, query, body) {

            if(!body.flightNumber || !body.arrivalDate) {
                return [];
            }

            // Fake up a no-flights scenario
            if(body.flightNumber === 'NO0001') {
                return [];
            }

            // fake up too many results
            if(body.flightNumber === 'SUM1000') {
                return [
                    tpl(params, query, body),
                    tpl(params, query, body)
                ];
            }

            // fake up multi-leg flight
            if(body.flightNumber === 'BA0072') {
                let res = tpl(params, query, body);

                // add additional departure
                res.departures.push({
                    port: 'MCT',
                    country: 'OM'
                });

                return [
                    res
                ];
            }

            // fake up service is down
            // Fake up sending incorrect information
            return [
                tpl(params, query, body)
            ];

        }
    }
};

module.exports = search;
module.exports.tpl = tpl;
