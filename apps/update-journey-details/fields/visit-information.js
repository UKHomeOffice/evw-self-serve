'use strict';

module.exports = {
  'uk-address-1': {
    validate: ['required', {
      type: 'maxlength', arguments: '35'
    }, {
      type: 'regex', arguments: /^([a-zA-Z0-9 ,.'_-]+)$/
    }]
  },
  'uk-address-2': {
    validate: [{
      type: 'maxlength', arguments: '35'
    }]
  },
  'uk-address-3': {
    validate: [{
      type: 'maxlength', arguments: '35'
    }]
  },
  'uk-address-4': {
    validate: [{
      type: 'maxlength', arguments: '35'
    }]
  },
  'uk-postcode': {
    validate: ['required', {
      type: 'maxlength', arguments: '35'
    }, {
      type: 'regex',
      arguments: '^(([gG][iI][rR] {0,}0[aA]{2})|((([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y]?[0-9][0-9]?)|((' +
      '[a-pr-uwyzA-PR-UWYZ][0-9][a-hjkstuwA-HJKSTUW])|([a-pr-uwyzA-PR-UWYZ][a-hk-yA-HK-Y][0-9]' +
      '[abehmnprv-yABEHMNPRV-Y]))) {0,}[0-9][abd-hjlnp-uw-zABD-HJLNP-UW-Z]{2}))$'
    }]
  }
};
