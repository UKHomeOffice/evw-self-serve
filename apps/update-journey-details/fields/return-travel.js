'use strict';

module.exports = {
  'travel-details-changed': {
    validate: ['required'],
    className: ['form-group'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'Yes',
      label: 'fields.travel-details-changed.options.yes.label'
    }, {
      value: 'No',
      label: 'fields.travel-details-changed.options.no.label'
    }]
  }
};
