'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;
const ErrorClass = require('hof').controllers.error;
const validateLib = require('validate.js');
const fse = require('fs-extra');
const options = {
  fullMessages: false,
};

let EvwBaseController = function EvwBaseController() {
  BaseController.apply(this, arguments);
};

util.inherits(EvwBaseController, BaseController);

let formatValue = (formValues, keyToValidate) => {
  if (keyToValidate.indexOf('date') > -1) {
    return `${formValues[keyToValidate + '-year']}-${formValues[keyToValidate + '-month']}-${formValues[keyToValidate + '-day']}`;
  }

  if (keyToValidate.indexOf('time') > -1) {
    return `${formValues[keyToValidate + '-hours']}:${formValues[keyToValidate + '-minutes']}`;
  }

  return formValues[keyToValidate];
};

EvwBaseController.prototype.validateField = function validateField(keyToValidate, req) {
  let validationRules = `validation/${keyToValidate}.js`;

  if (fse.existsSync(validationRules)) {
    let fieldValue = formatValue(req.form.values, keyToValidate);
    let rules = require(`../../../${validationRules}`).validate(fieldValue, req.sessionModel);

    req.sessionModel.set(keyToValidate, fieldValue);

    let field = {};
    field[keyToValidate] = fieldValue;

    let schema = {};
    schema[keyToValidate] = rules;

    let validationErrors = validateLib.validate(field, schema, options);

    if (validationErrors !== undefined) {
      return new ErrorClass(keyToValidate, {
        type: validationErrors[keyToValidate]
      });
    }
  }
};

module.exports = EvwBaseController;
