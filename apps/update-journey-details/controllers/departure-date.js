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
      .findFlight(this.lookupData.number.replace(/\s+/g), this.lookupData.date)
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

  getTravelDates(req) {
    const details = req.sessionModel.get('flightDetails');
    let arrivalDate = details.arrivalDateRaw;
    let arrivalTime = details.arrivalTime;
    let arrivalTimezone = details.arrivalTimezone;
    let departureDate = details.departureDateRaw;
    let departureTime = details.departureTime;
    let departureTimezone = details.departureTimezone;

    return {
      arrival: flightLookup.momentDate({
        date: arrivalDate,
        time: arrivalTime,
        timezone: arrivalTimezone
      }).tz('Europe/London'),
      departure: flightLookup.momentDate({
        date: departureDate,
        time: departureTime,
        timezone: departureTimezone
      }).tz('Europe/London')
    };
  }

  validateField(key, req) {
    const defaultValidationErrors = super.validateField(key, req);
    if (defaultValidationErrors) {
      return defaultValidationErrors;
    }
    const timeIsSet = time => time !== '' && time !== 'Invalid date';
    const flightFound = () => req.sessionModel.get('flightDetails');
    if (key === 'departure-date' && timeIsSet(req.form.values['departure-time']) && flightFound()) {
      // get date using timezone local to flight arrival/departure
      // then convert to Europe/London timezone for comparisons for validation.
      const travelDates = this.getTravelDates(req);
      const allowTimeTravel = false;
      const errorType = validators.validateDepartureDate(travelDates.arrival, travelDates.departure, allowTimeTravel);
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
