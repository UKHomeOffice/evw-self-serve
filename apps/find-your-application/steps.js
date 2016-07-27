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
    next: '/link-sent',
    forks: [
    {
      target: '/evw-expired',
      condition: (req) => req.sessionModel.get('evwLookupError') === 'CASE_EXPIRED'
    },
    {
      target: '/evw-not-verified',
      condition: (req) => req.sessionModel.get('evwLookupError') === 'CASE_NOT_VERIFIED'
    }]
  },
  '/link-sent': {
    template: 'link-sent',
    controller: require('./controllers/link-sent')
  },
  '/evw-expired': {
    template: 'evw-expired'
  },
  '/evw-not-verified': {
    template: 'evw-not-verified'
  }
};
