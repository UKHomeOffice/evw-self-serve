'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const getTypeaheadValue = require('../../../lib/typeahead-options').getTypeaheadValue;
const allAirportsPortsStations = require('../../../lib/typeahead-options').all;

module.exports = class CheckYourAnswersController extends EvwBaseController {
  locals(req, res) {
    let displayProps = {};
    if (req.sessionModel.get('know-departure-details') === 'Yes') {
      const portToDisplay = getTypeaheadValue(req.sessionModel.get('uk-port-of-departure'), allAirportsPortsStations);
      displayProps.ukPortOfDepartureDisplay = portToDisplay;
    }
    return Object.assign({
      knowDepartureDetailsYes: req.sessionModel.get('know-departure-details') === 'Yes',
      knowDepartureDetailsNo: req.sessionModel.get('know-departure-details') === 'No'
    }, displayProps, super.locals.call(this, req, res));
  }
};
