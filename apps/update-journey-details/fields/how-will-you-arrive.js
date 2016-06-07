'use strict';

module.exports = {
  'transport-options': {
    validate: ['required'],
    className: ['form-group'],
    options: [{
      value: 'by-plane',
      label: 'fields.transport-options.options.by-plane.label'
    }, {
      value: 'by-train',
      label: 'fields.transport-options.options.by-train.label'
    }, {
      value: 'by-private-plane',
      label: 'fields.transport-options.options.by-private-plane.label'
    }, {
      value: 'by-boat',
      label: 'fields.transport-options.options.by-boat.label'
    }, {
      value: 'by-land',
      label: 'fields.transport-options.options.by-land.label'
    }]
  }
};
