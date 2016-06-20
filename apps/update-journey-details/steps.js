'use strict';

module.exports = {
  '/': {
    controller: require('../common/controllers/start'),
    next: '/how-will-you-arrive'
  },
  '/how-will-you-arrive': {
    template: 'how-will-you-arrive',
    fields: [
      'transport-options'
    ],
    next: '/email-us'
  },
  '/email-us': {
    template: 'email-us',
    controller: require('./controllers/email-us'),
    clearSession: false
  },
  '/enter-your-details': {
    template: 'enter-your-details',
    fields: [
      'dob',
      'evw-number'
    ],
    // next: '/email-us',
    clearSession: false
  }
};
