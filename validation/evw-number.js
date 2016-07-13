'use strict';

module.exports = {
  rules: (value, model) => {
    if (model.get('evwLookupError') === 'CASE_NOT_FOUND') {
      return Object.assign({
        length: {
          minimum: 999,
          tooShort: 'evw-number.not-found'
        }
      });
    }
  }
};
