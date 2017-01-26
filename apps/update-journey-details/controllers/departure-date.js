'use strict';

const ErrorClass = require('hof').controllers.error;
const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('../../../lib/flight-lookup');
const logger = require('../../../lib/logger');
const validators = require('../../../lib/validators');

module.exports = class DepartureDateController extends EvwBaseController {

  process(req, res, callback) {
    super.process(req, res, this.lookup.bind(this, req, res, callback));
  }

  lookup(req, res, callback) {
    let lookupData = flightLookup.formatPost({
      flightNumber: req.sessionModel.get('flight-number'),
      departureDateDay: req.form.values['departure-date-day'],
      departureDateMonth: req.form.values['departure-date-month'],
      departureDateYear: req.form.values['departure-date-year']
    });

    logger.info('looking up flight', lookupData);

    return flightLookup.findFlight(lookupData.number, lookupData.date)
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
  }

  validateField(key, req) {
    const defaultValidationErrors = super.validateField(key, req);
    if (defaultValidationErrors) {
      return defaultValidationErrors;
    }
    const timeIsSet = time => time !== '' && time !== 'Invalid date';
    const flightFound = () => req.sessionModel.get('flightDetails');
    if (key === 'departure-date' && timeIsSet(req.form.values['departure-time']) && flightFound()) {
      const arrivalDate = req.sessionModel.get('flightDetails').arrivalDateRaw;
      const arrivalTime = req.sessionModel.get('flightDetails').arrivalTime;
      const arrivalTimezone = req.sessionModel.get('flightDetails').arrivalTimezone;
      const departureDate = req.sessionModel.get('flightDetails').departureDateRaw;
      const departureTime = req.sessionModel.get('flightDetails').departureTime;
      const departureTimezone = req.sessionModel.get('flightDetails').departureTimezone;

      const arrivalDateTime = flightLookup.momentDate({
        date: arrivalDate,
        time: arrivalTime,
        timezone: arrivalTimezone
      }).tz('Europe/London');
      const departureDateTime = flightLookup.momentDate({
        date: departureDate,
        time: departureTime,
        timezone: departureTimezone
      }).tz('Europe/London');

      const errorType = validators.validateDepartureDate(arrivalDateTime, departureDateTime);
      if (errorType) {
        return new ErrorClass(key, {
          key: key,
          type: errorType,
          redirect: undefined
        });
      }
      return false;
    }
  }

  locals(req, res) {
    return Object.assign({
      flightNumber: req.sessionModel.get('flight-number')
    }, super.locals(req, res));
  }

};
