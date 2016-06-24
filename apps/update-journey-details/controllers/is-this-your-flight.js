'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;

const IsThisYourFlightController = function IsThisYourFlightController() {
  BaseController.apply(this, arguments);
};

util.inherits(IsThisYourFlightController, BaseController);

IsThisYourFlightController.prototype.locals = function locals(req, res) {
  return Object.assign(
    {
        flightDetails: {
          flightNumber: 'EK0009',
          departureAirport: 'Dubai',
          arrivalAirport: 'London - Gatwick',
          arrivalDate: '08/08/2016',
          arrivalTime: '19:45'
        }
    },
    BaseController.prototype.locals.call(this, req, res)
  );
};

module.exports = IsThisYourFlightController;
