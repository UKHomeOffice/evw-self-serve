'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const ErrorClass = require('hof').controllers.error;
const moment = require('moment');
require('moment-timezone');
const validators = require('../../../lib/validators');
const stations = require('../../../data/stations.json');

module.exports = class TrainDateOfDepartureController extends EvwBaseController {

  getTrainStation(stationCodeName) {
    const stationName = stationCodeName.substring(stationCodeName.indexOf('_') + 1);
    return stations.find(s => s.name === stationName);
  }

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
      const departureStation = this.getTrainStation(req.form.values['train-departure-station']);

      const arrivalDateTime = moment(arrivalDate + ' ' + arrivalTime, 'YYYY-MM-DD HH:mm');
      const departureDateTime = moment(departureDate + ' ' + departureTime, 'YYYY-MM-DD HH:mm').tz(departureStation.timezone, true).utc();

      const errorType = validators.validateDepartureDate(arrivalDateTime, departureDateTime, false);
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
};
