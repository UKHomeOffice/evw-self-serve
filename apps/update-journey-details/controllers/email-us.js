'use strict';

const _ = require('lodash');
const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;
const translations = require('../translations/en/default.json');
const list = translations.pages['email-us'].list;

const EmailUsController = function EmailUsController() {
  BaseController.apply(this, arguments);
};

util.inherits(EmailUsController, BaseController);

EmailUsController.prototype.locals = function locals(req, res) {
  let mod = req.sessionModel.toJSON();
  let key = mod['transport-options'];

  return _.extend(
    {
        transport: key,
        list: list[key]
    },
    BaseController.prototype.locals.call(this, req, res)
  );
};

module.exports = EmailUsController;
