'use strict';

const util = require('util');
const BaseController = require('hof').controllers.base;

const IsThisYourFlightController = function IsThisYourFlightController() {
  BaseController.apply(this, arguments);
};

util.inherits(IsThisYourFlightController, BaseController);

IsThisYourFlightController.prototype.locals = function locals(req, res) {
  return Object.assign({
    flightDetails: req.sessionModel.get('flightDetails')
  }, BaseController.prototype.locals.call(this, req, res));
};

module.exports = IsThisYourFlightController;
