'use strict';

module.exports = {
  'flight-number': {
    validate: [
      'required', {
        type: 'maxlength',
        arguments: '9'
      }, {
        type: 'regex',
        arguments: '^[a-zA-Z0-9]{2,3}[0-9]{1,4}[a-zA-Z]?$'
      }
    ],
    className: ['form-groups']
  }
};
