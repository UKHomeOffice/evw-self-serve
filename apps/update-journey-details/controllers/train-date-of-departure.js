'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const moment = require('moment');
const validators = require('../../../lib/validators');

module.exports = class TrainDateOfDepartureController extends EvwBaseController {
  validateField(key, req) {
    const defaultValidationErrors = super.validateField(key, req);
    if (defaultValidationErrors) {
      return defaultValidationErrors;
    }
    const timeIsSet = time => time !== '' && time !== 'Invalid date';
    if (key === 'train-departure-date' && timeIsSet(req.form.values['train-departure-time'])) {
      const arrivalDate = req.form.values['train-arrival-date'];
      const arrivalTime = req.form.values['train-arrival-time'];
      const departureDate = req.form.values['train-departure-date'];
      const departureTime = req.form.values['train-departure-time'];
      const arrivalDateTime = moment(arrivalDate + ' ' + arrivalTime, 'YYYY-MM-DD HH:mm');
      const departureDateTime = moment(departureDate + ' ' + departureTime, 'YYYY-MM-DD HH:mm');

      const errorType = validators.validateDepartureDate(arrivalDateTime, departureDateTime, true);
      if (errorType) {
        return new this.ValidationError(key, {
          key: key,
          type: errorType,
          redirect: undefined
        });
      }
      return false;
    }
  }
};
