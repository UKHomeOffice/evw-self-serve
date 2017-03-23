'use strict';

const ErrorClass = require('hof').controllers.error;
const EvwBaseController = require('../../common/controllers/evw-base');
const flightLookup = require('evw-ffs');
const logger = require('../../../lib/logger');
const validators = require('../../../lib/validators');

module.exports = class DepartureDateController extends EvwBaseController {

  process(req, res, callback) {
    super.process(req, res, this.lookup.bind(this, req, res, callback));
  }

  lookup(req, res, callback) {
    this.lookupData = flightLookup.formatPost({
      flightNumber: req.sessionModel.get('flight-number'),
      departureDateDay: req.form.values['departure-date-day'],
      departureDateMonth: req.form.values['departure-date-month'],
      departureDateYear: req.form.values['departure-date-year']
    });

    logger.info('looking up flight using this data:', this.lookupData);

    return flightLookup
      .findFlight(this.lookupData.number, this.lookupData.date)
      .then(foundData => {
        this.flightData = foundData.body;
        this.setFlight(req, res, callback);
      }).catch(error => {
        // timeout/error etc
        logger.error('flight lookup error');
        logger.error(error);
        req.sessionModel.set('flightDetails', null);
        callback();
      });
  }

  setFlight(req, res, callback) {
    logger.info('flight service response for', this.lookupData, this.flightData);
    const flight = this.flightData.flights[0] || false;
    req.sessionModel.set('flightDetails', null);

    if (flight && flight.departure.country === 'GBR') {
      logger.info('Rejecting domestic flight', flight);
      req.sessionModel.set('flightDetails', null);
      return callback();
    }

    if (flight) {
      const dataLists = {
        countries: require('../../../data/nationalities.json'),
        airports: require('../../../data/airports.json')
      };
      const mappedFlight = flightLookup.mapFlight(flight, dataLists);
      req.sessionModel.set('flightDetails', mappedFlight);
    }
    callback();
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
