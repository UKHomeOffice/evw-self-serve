'use strict';

const util = require('util');
const EvwBaseController = require('../../common/controllers/evw-base');
const verifyEvw = require('../../../lib/verify-evw');

let EnterYourDetailsController = function EnterYourDetailsController() {
  EvwBaseController.apply(this, arguments);
};

util.inherits(EnterYourDetailsController, EvwBaseController);

EnterYourDetailsController.prototype.saveValues = function saveValues(req, res, callback) {
  let lookupValues = verifyEvw.formatPost(req.form.values);

  verifyEvw.findApplication(lookupValues.evwNumber, lookupValues.dateOfBirth).then(function (response) {
    let result = verifyEvw.mapResponse(response.body);

    // Application found
    if (result === 'success') {
      req.sessionModel.set('isEvwVerified', true);
    }

    // Application not found, page gets set in steps.js

    callback();
  });
}

module.exports = EnterYourDetailsController;