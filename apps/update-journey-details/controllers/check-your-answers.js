'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class CheckYourAnswersController extends EvwBaseController {
  locals(req, res) {
    let displayProps = {};
    if (req.sessionModel.get('know-departure-details') === 'Yes') {
      const getOptionValue = value => typeof value === 'string' ? value.substr(value.indexOf('_') + 1) : '';
      const portToDisplay = getOptionValue(req.sessionModel.get('uk-port-of-departure'));
      displayProps.ukPortOfDepartureDisplay = portToDisplay;
    }
    return Object.assign({
      knowDepartureDetailsYes: req.sessionModel.get('know-departure-details') === 'Yes',
      knowDepartureDetailsNo: req.sessionModel.get('know-departure-details') === 'No'
    }, displayProps, super.locals.call(this, req, res));
  }
};
