'use strict';

var tpl = function template (params, query) {
  let port = 'LGW';
  let time = '18:25';
  if (query.flightNumber === 'BI0097') {
    port = 'LHR';
    time = '06:40';
  }
  return {
    flightNumber: query.flightNumber,
    departure: {
      country: 'AE',
      port: 'DXB',
      timezone: 'Asia/Dubai',
      date: query.departureDate,
      time: '14:35'
    },
    arrival: {
      country: 'GBR',
      port: port,
      timezone: 'Europe/London',
      date: query.departureDate,
      time: time
    }
  };
};

var search = {

  path: '/check-flight',

  cache: false,

  status: function status (req, res) {
    // mock fail state
    if (req.query.flightNumber === 'FAIL999') {
      res.status(500).send('Service is down');
    } else {
      res.status(200).json({
        flights: this.template.flights(req.params, req.query)
      });
    }
  },

  template: {
    flights: function flights (params, query) {

      if (!query.flightNumber || !query.departureDate) {
        return [];
      }

      // Fake up a no-flights scenario
      if (query.flightNumber === 'NO001') {
        return [];
      }

      // fake up too many results
      if (query.flightNumber === 'SUM1000') {
        return [
          tpl(params, query),
          tpl(params, query)
        ];
      }

      return [
        tpl(params, query)
      ];

    }
  }
};

module.exports = search;
module.exports.tpl = tpl;
