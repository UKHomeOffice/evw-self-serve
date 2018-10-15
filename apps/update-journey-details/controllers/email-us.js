'use strict';

const util = require('util');
const controllers = require('hof').controllers;
const BaseController = controllers.base;
const translations = require('../translations/en/default.json');
const list = translations.pages['email-us'].list;

const EmailUsController = function EmailUsController() {
   BaseController.apply(this, arguments);
};

util.inherits(EmailUsController, BaseController);

let listItems = (key, mod) => {
  if (key !== 'by-land' && !list[key][0].name.includes(mod['evw-number'])) {
    list[key].unshift({
      name: `${list['reference-number-1']} ${mod['evw-number']} ${list['reference-number-2']}`
    });
  }

  return list[key];
};

EmailUsController.prototype.locals = function locals(req, res) {
  let mod = req.sessionModel.toJSON();
  let key = mod['transport-options'];

  return Object.assign({
    transport: key,
    list: listItems(key, mod)
  }, BaseController.prototype.locals.call(this, req, res));
};

module.exports = EmailUsController;
