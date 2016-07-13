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
    forks: [{
      target: '/evw-expired',
      condition: (req) => {
        return req.sessionModel.get('caseNotUpdatable');
      }
    }]
  },
  '/link-sent': {
    template: 'link-sent'
  },
  '/evw-expired': {
    template: 'evw-expired'
  }
};
