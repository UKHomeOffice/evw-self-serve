'use strict';

module.exports = {
  '/': {
    controller: require('../common/controllers/start'),
    next: '/enter-your-details'
  },
  '/enter-your-details': {
    template: 'enter-your-details',
    controller: require('./controllers/enter-your-details'),
    fields: [
      'dob',
      'dob-day',
      'dob-month',
      'dob-year',
      'evw-number'
    ],
    next: '/link-sent'
  },
  '/link-sent': {
    template: 'link-sent'
  },
  '/email-us': {
    template: 'email-us',
    controller: require('./controllers/email-us'),
    clearSession: false
  }
};
