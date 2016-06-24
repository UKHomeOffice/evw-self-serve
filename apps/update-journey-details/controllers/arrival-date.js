'use strict';

const util = require('util');
const DateController = require('hof').controllers.date;

let ArrivalDateController = function ArrivalDateController() {
  this.dateKey = 'arrival-date';
  DateController.apply(this, arguments);
};

util.inherits(ArrivalDateController, DateController);

module.exports = ArrivalDateController;