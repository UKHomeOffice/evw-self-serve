'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('../../../lib/flight-lookup');
const logger = require('../../../lib/logger');

module.exports = class ArrivalDateController extends EvwBaseController {
  process(req, res, callback) {
    super.process(req, res, () => {
      let lookupData = flightLookup.formatPost({
        flightNumber: req.sessionModel.get('flight-number'),
        arrivalDateDay: req.form.values['arrival-date-day'],
        arrivalDateMonth: req.form.values['arrival-date-month'],
        arrivalDateYear: req.form.values['arrival-date-year']
      });

      logger.info('looking up flight', lookupData);

      flightLookup.findFlight(lookupData.number, lookupData.date).then((foundData) => {
        logger.info('flight service response for', lookupData, foundData.body);
        let flight = foundData.body.flights[0];

        // Flight found
        if (typeof flight !== 'undefined') {

          let departures = flightLookup.mapDepartures(flight.departures);
          let mappedFlight = flightLookup.mapFlight(flight, req.sessionModel);

          if(flight.departures.length === 1) {
            Object.assign(mappedFlight, departures[0]); // add first departure to flight
          }

          req.sessionModel.set('flightDetails', mappedFlight);
        }  else {
          req.sessionModel.set('flightDetails', null);
        }

        // Flight not found, page gets set in steps.js
        callback();
      });
    });
  }
};
