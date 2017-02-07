'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

class IsThisYourFlightController extends EvwBaseController {
  getValues(req, res, callback) {
    if (!req.sessionModel.get('flightDetails')) {
      return res.redirect('flight-number');
    }
    super.getValues(req, res, callback);
  }

  locals(req, res) {
    return Object.assign({
      flightDetails: req.sessionModel.get('flightDetails')
    }, super.locals(req, res));
  }
}

module.exports = IsThisYourFlightController;
