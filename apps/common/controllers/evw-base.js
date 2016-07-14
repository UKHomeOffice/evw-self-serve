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
  this.dateFormat = 'DD-MM-YYYY';
  DateController.apply(this, arguments);
};

util.inherits(EvwBaseController, DateController);

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

// Format date/time
let formatValue = (formValues, key) => {
  if(key.match(/dob$|date$/gi) ) {
    return formatting.getDate(formValues, key);
  }

  if (key.indexOf('time') > -1) {
    return formatting.getTime(formValues, key);
  }

  return formValues[key];
};

EvwBaseController.prototype.validateField = function validateField(keyToValidate, req) {
  try {
    let fieldValue = formatValue(req.form.values, keyToValidate);
    let rules = require(`../../../validation/${keyToValidate}`).rules(fieldValue, req.sessionModel);

    req.sessionModel.set(keyToValidate, fieldValue);

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
