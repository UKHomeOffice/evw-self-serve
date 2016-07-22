'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('../../../lib/flight-lookup');
const logger = require('../../../lib/logger');

module.exports = class ArrivalDateController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDatesTimes(options.fields);
  }

  saveValues(req, res, callback) {
    super.saveValues(req, res, () => {
      let lookupData = flightLookup.formatPost({
        flightNumber: req.sessionModel.get('flight-number'),
        arrivalDateDay: req.form.values['arrival-date-day'],
        arrivalDateMonth: req.form.values['arrival-date-month'],
        arrivalDateYear: req.form.values['arrival-date-year']
      });

      logger.info('looking up flight', lookupData);

      flightLookup.findFlight(lookupData.number, lookupData.date).then(function (foundData) {
        logger.info('flight service response for', lookupData, foundData.body);
        let flight = foundData.body.flights[0];

        // Flight found
        if (typeof flight !== 'undefined') {
          let mappedFlight = flightLookup.mapFlight(flight, req.sessionModel);
          req.sessionModel.set('flightDetails', mappedFlight);
        }  else {
          req.sessionModel.set('flightDetails', null);
        }

        // Flight not found, page gets set in steps.js
        callback();
      });
    });
  }
}
