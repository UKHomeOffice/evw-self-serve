'use strict';

const controllers = require('hof').controllers;
const BaseController = controllers.base;
const ErrorController = controllers.error;
const formatting = require('../../../lib/formatting');

module.exports = class EvwBaseController extends BaseController {

  constructor(settings) {
    super(settings);
    this.dateKeys = settings.options && settings.options.dateKeys || [];
    this.timeKeys = settings.options && settings.options.timeKeys || [];
  }

  getNextStep (req, res) {
    this.confirmStep = '/check-your-answers';
    return super.getNextStep(req, res);
  }

  process(req, res, callback) {
    this.dateKeys.forEach(key => {
      req.form.values[key] = formatting.getDate(req.form.values, key);
      req.form.values[`${key}-formatted`] = formatting.getFormattedDate(req.form.values[key]);
    });
    this.timeKeys.forEach(key => {
      req.form.values[key] = formatting.getFormattedTime(formatting.getTime(req.form.values, key));
    });
    super.process(req, res, callback);
  }

  validateField(key, req) {
    let error = super.validateField(key, req);
    if (req.fields &&
      req.fields[key] &&
      req.fields[key].hasOwnProperty('validators')
    ) {
      let value = req.form.values[key];
      req.fields[key].validators.forEach((validator) => {
        validator.formValues = Object.assign({}, req.sessionModel.attributes, req.form.values);
        if (validator.type(value, validator.arguments)) {
          error = new ErrorController(key, {
            type: validator.type.name
          });
        }
      });
    }
    return error;
  }

};
