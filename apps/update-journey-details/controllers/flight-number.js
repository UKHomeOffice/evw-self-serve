'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class FlightNumberController extends EvwBaseController {

  process(req, res, callback) {
    req.sessionModel.set('is-this-your-flight', null);
    super.process(req, res, callback);
  }

};
