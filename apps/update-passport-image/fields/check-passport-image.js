'use strict';

module.exports = {
  'check-passport-image': {
    validate: ['required'],
    className: ['form-group'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'Yes',
      label: 'fields.check-passport-image.options.yes.label'
    },
    {
      value: 'No',
      label: 'fields.check-passport-image.options.no.label'
    }]
  }
};
