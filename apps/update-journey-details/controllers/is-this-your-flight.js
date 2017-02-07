'use strict';

const BaseController = require('hof').controllers.base;

class IsThisYourFlightController extends BaseController {
  locals(req, res) {
    return Object.assign({
      flightDetails: req.sessionModel.get('flightDetails')
    }, super.locals(req, res));
  }
}

module.exports = IsThisYourFlightController;
