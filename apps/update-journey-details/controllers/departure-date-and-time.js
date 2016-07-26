'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class EnterYourDetailsController extends EvwBaseController {

  constructor(options) {
    super(options);
    super.applyDatesTimes(options.fields);
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
}
