'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const DateController = controllers.date;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const logger = require('../../../lib/logger');
const options = {
  fullMessages: false,
};
const formatting = require('../../../lib/formatting');


let EvwBaseController = function EvwBaseController() {
  DateController.apply(this, arguments);
};

util.inherits(EvwBaseController, DateController);

// A hack because Ralph can't figure out
// passing options to a constructor 🙍🏽
EvwBaseController.prototype.getNextStep = function (req, res) {
  this.confirmStep = '/check-your-answers';
  return DateController.prototype.getNextStep.call(this, req, res);
}

EvwBaseController.prototype.process = function process(req, res, callback) {
  return DateController.prototype.process.call(this, req, res, function processTime() {
    if(this.timeKey) {
      req.form.values[this.timeKey] = formatting.getTime(req.form.values, this.timeKey);
    }
    callback();
  }.bind(this));
};

EvwBaseController.prototype.applyDatesTimes = function firstDates(fields) {
  Object.keys(fields).forEach((key) => {
    let type = fields[key].type;
    if(type && type.indexOf('date') > -1) {
      this.dateKey = key;
    };
    if(type && type.indexOf('time') > -1) {
      this.timeKey = key;
    };
  });
}

EvwBaseController.prototype.validateField = function validateField(keyToValidate, req) {
  try {
    let fieldValue = formatting.setDateTimes(req.form.values, keyToValidate);
    req.sessionModel.set(keyToValidate, fieldValue);
    let rules = require(`../../../validation/${keyToValidate}`).rules(fieldValue, req.sessionModel);

    let field = {};
    field[keyToValidate] = fieldValue;

    let schema = {};
    schema[keyToValidate] = rules;

    let validationErrors = validateLib.validate(field, schema, options);

    // found custom rules
    if (validationErrors !== undefined) {
      return new ErrorClass(keyToValidate, {
        type: validationErrors[keyToValidate]
      });
    }
    // 'normal' validators
    return DateController.prototype.validateField.apply(this, arguments);
  } catch (e) {
    return DateController.prototype.validateField.apply(this, arguments);
    logger.info(`No validation rules found for ${keyToValidate}`);
  }
};

module.exports = EvwBaseController;
