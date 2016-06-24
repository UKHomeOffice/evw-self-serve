'use strict';

module.exports = {
  'is-this-your-flight': {
    validate: ['required'],
    className: ['form-group', 'inline'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'yes',
      label: 'fields.is-this-your-flight.options.yes.label'
    }, {
      value: 'no',
      label: 'fields.is-this-your-flight.options.no.label'
    }]
  }
};
