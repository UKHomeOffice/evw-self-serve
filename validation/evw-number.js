'use strict';

module.exports = {
  rules: (value, model) => {
    let err = model.get('evwLookupError');
    if (err === 'CASE_NOT_FOUND' ||
        err === 'INVALID_TOKEN') {
      return Object.assign({
        length: {
          minimum: 999,
          tooShort: 'evw-number.not-found'
        }
      });
    }
  }
};
