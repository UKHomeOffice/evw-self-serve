'use strict';

module.exports = {
  rules: (value, model) => {
    if (model.get('caseNotFound')) {
      return Object.assign({
        length: {
          minimum: 999,
          tooShort: 'evw-number.not-found'
        }
      });
    }
  }
};
