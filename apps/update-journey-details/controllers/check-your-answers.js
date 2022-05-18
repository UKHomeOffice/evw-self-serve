'use strict';

const moment = require('moment');

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class CheckYourAnswersController extends EvwBaseController {
  locals(req, res) {
    const getOptionValue = value => typeof value === 'string' ? value.substr(value.indexOf('_') + 1) : '';
    let displayProps = {};
    if (req.sessionModel.get('know-departure-details') === 'Yes') {
      const portToDisplay = getOptionValue(req.sessionModel.get('uk-port-of-departure'));
      displayProps.ukPortOfDepartureDisplay = portToDisplay;
    }

    if (req.sessionModel.get('train-number')) {
      displayProps.trainDepartureCountry = getOptionValue(req.sessionModel.get('train-departure-country'));
      displayProps.trainDepartureStation = getOptionValue(req.sessionModel.get('train-departure-station'));
      displayProps.trainArrivalStation = getOptionValue(req.sessionModel.get('train-arrival-station'));
      displayProps.trainDepartureDate = moment(req.sessionModel.get('train-departure-date')).format('DD/MM/YYYY');
      displayProps.trainArrivalDate = moment(req.sessionModel.get('train-arrival-date')).format('DD/MM/YYYY');
    }


    return Object.assign({
      knowDepartureDetailsYes: req.sessionModel.get('know-departure-details') === 'Yes',
      knowDepartureDetailsNo: req.sessionModel.get('know-departure-details') === 'No'
    }, displayProps, super.locals.call(this, req, res));
  }
};
