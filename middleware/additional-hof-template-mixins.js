'use strict';

const fs = require('fs');
const path = require('path');
const Hogan = require('hogan.js');

function isRequired(field) {
  var isRequired = false;

  if (field.required !== undefined) {
    isRequired = field.required;
  }
  else if (field.validate) {
    isRequired = field.validate.indexOf('required') > -1;
  }

  return isRequired;
}

module.exports = function additionalHofTemplateMixins() {

  return function (req, res, next) {
    // Adds an additional HOF template mixin to res.locals
    //
    // The other mixins are added by hof-template-mixins, a dependency of hof: https://github.com/UKHomeOfficeForms/hof-template-mixins/blob/v2.0.0/lib/template-mixins.js
    //
    // We currently need to add another one, to enable us to use a checkbox and add the "visuallyhidden" class to its label.
    //
    // Most of the code below is essentially copied from hof-template-mixins, particularly the checkbox function: https://github.com/UKHomeOfficeForms/hof-template-mixins/blob/v2.0.0/lib/template-mixins.js#L251
    //
    // Later versions of hof-template-mixins allow a labelClass to be supplied to the checbox mixin. If we upgrade, we will no longer need this middleware
    res.locals['checkbox-with-hidden-label'] = function checkboxWithHiddenLabel() {
      return function (key) {

        const fields = req.fields;
        const translate = req.translate;

        const context = {
                key: key,
              label: translate(fields && fields[key] && fields[key].label || 'fields.' + key + '.label'),
          className: (fields && fields[key] && fields[key].className) || 'block-label',
           selected: this.values && (this.values[key] !== undefined ? this.values[key].toString() === 'true' : false),
           required: fields && fields[key] && isRequired(fields[key]),
              error: this.errors && this.errors[key],
            invalid: this.errors && this.errors[key] && isRequired(fields[key]),
             toggle: fields && fields[key] && fields[key].toggle
        };

        const compiledTemplate = Hogan.compile(fs.readFileSync(path.join(req.app.get('views'), 'partials/forms/checkbox-with-hidden-label.html'), 'utf8'));

        return compiledTemplate.render(context);
      };
    };

    next();
  };
};
