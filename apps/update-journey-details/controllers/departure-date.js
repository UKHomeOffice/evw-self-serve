'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('../../../lib/flight-lookup');
const logger = require('../../../lib/logger');

module.exports = class DepartureDateController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDatesTimes(options.fields);
  }

  process(req, res, callback) {
    super.process(req, res, () => {
      let lookupData = flightLookup.formatPost({
        flightNumber: req.sessionModel.get('flight-number'),
        departureDateDay: req.form.values['departure-date-day'],
        departureDateMonth: req.form.values['departure-date-month'],
        departureDateYear: req.form.values['departure-date-year']
      });

      logger.info('looking up flight', lookupData);

      flightLookup.findFlight(lookupData.number, lookupData.date)
        .then(foundData => {
          logger.info('flight service response for', lookupData, foundData.body);
          const flight = foundData.body.flights[0];

          // Flight found
          if (typeof flight !== 'undefined') {
            const mappedFlight = flightLookup.mapFlight(flight, req.sessionModel);
            req.sessionModel.set('flightDetails', mappedFlight);
          }  else {
            req.sessionModel.set('flightDetails', null);
          }

          // Flight not found, page gets set in steps.js
          callback();
        })
        .catch(error => {
          // timeout/error etc
          logger.error('flight lookup error', error);
          req.sessionModel.set('flightDetails', null);
          callback();
        });
    });
  }

  locals(req, res) {
    return Object.assign({
      flightNumber: req.sessionModel.get('flight-number')
    }, super.locals(req, res));
  }

};
