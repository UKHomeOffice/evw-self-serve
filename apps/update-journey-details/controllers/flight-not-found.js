'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
module.exports = class ArrivalDateController extends EvwBaseController {

  constructor(options) {
    super(options);
  }

  getValues(req, res, callback) {
    super.getValues(req, res, () => {
      // clear flightDetails from session so we can seach again
      req.sessionModel.set('flight-number', null);
      req.sessionModel.set('arrival-date-day', null);
      req.sessionModel.set('arrival-date-month', null);
      req.sessionModel.set('arrival-date-year', null);
      req.sessionModel.set('flightDetails', null);
      callback();
    });
  }

  locals(req, res) {
    return Object.assign({
      evwNumber: req.sessionModel.get('evw-number')
    }, super.locals.call(this, req, res));
  }
}
