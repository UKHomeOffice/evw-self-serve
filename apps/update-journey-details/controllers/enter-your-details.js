'use strict';

const util = require('util');
const DateController = require('hof').controllers.date;

let EnterYourDetailsController = function EnterYourDetailsController() {
  this.dateKey = 'dob';
  DateController.apply(this, arguments);
};


EnterYourDetailsController.prototype.validateField = function validateField(keyToValidate, req) {
    console.log('keyToValidate',keyToValidate); // wtf
    return DateController.prototype.validateField.call(this, keyToValidate, req, false);
};

util.inherits(EnterYourDetailsController, DateController);

module.exports = EnterYourDetailsController;