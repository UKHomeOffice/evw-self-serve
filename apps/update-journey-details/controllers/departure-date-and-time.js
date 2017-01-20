'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const ErrorClass = require('hof').controllers.error;
const validators = require('../../../lib/validators');
const moment = require('moment');

module.exports = class DepartureDateTimeController extends EvwBaseController {

  validateField(key, req) {
    const defaultValidationErrors = super.validateField(key, req);
    if (defaultValidationErrors) {
      return defaultValidationErrors;
    }
    const timeIsSet = time => time !== '' && time !== 'Invalid date';
    if (key === 'departure-date' && timeIsSet(req.form.values['departure-time'])) {
      /* eslint-disable max-len */
      const arrivalDate = req.sessionModel.get('arrival-date');
      const arrivalTime = req.sessionModel.get('flightDetails').arrivalTime;
      /* eslint-enable max-len */
      const departureDate = req.form.values['departure-date'];
      const departureTime = req.form.values['departure-time'];
      const arrivalDateTime = moment(arrivalDate + ' ' + arrivalTime, 'YYYY-MM-DD HH:mm');
      const departureDateTime = moment(departureDate + ' ' + departureTime, 'YYYY-MM-DD HH:mm');

      const errorType = validators.validateDepartureDate(arrivalDateTime, departureDateTime, true);
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
    let flightDetails = req.sessionModel.get('flightDetails');
    return Object.assign({
      flightDetails: {
        flightNumber: flightDetails.flightNumber,
        departureAirport: flightDetails.departureAirport
      }
    }, super.locals.call(this, req, res));
  }
};
