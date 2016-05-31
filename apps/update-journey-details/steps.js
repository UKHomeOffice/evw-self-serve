'use strict';

module.exports = {
  '/': {
    controller: require('../common/controllers/start'),
    next: '/how-will-you-arrive'
  },
  '/how-will-you-arrive': {
    template: 'how-will-you-arrive',
    fields: [
      'transport-options',
      'example-dob',
      'example-dob-day',
      'example-dob-month',
      'example-dob-year',
      'example-text',
      'example-email'
    ],
    next: '/second-page'
  },
  '/second-page': {
    template: 'second-page',
    fields: [
      'yes-no-radio-toggler',
      'example-toggled-text'
    ],
    next: '/third-page'
  },
  '/third-page': {
    template: 'third-page',
    fields: [
      'yes-no-radio',
      'example-depends-on-text'
    ],
    next: '/fourth-page'
  },
  '/fourth-page': {
    controller: require('./controllers/fourth-page'),
    template: 'fourth-page',
    fields: ['multiples-input'],
    next: '/confirm'
  },
  '/confirm': {
    controller: require('./controllers/confirm'),
    template: 'confirm.html',
    next: '/confirmation'
  },
  '/confirmation': {
    template: 'confirmation.html',
    backLink: false,
    clearSession: true
  }
}
;
