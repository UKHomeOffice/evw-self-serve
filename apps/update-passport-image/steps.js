'use strict';

module.exports = {
  '/upload-passport-image': {
    controller: require('./controllers/upload-passport-image'),
    fields: [
      'passport-image'
    ],
    template: 'upload-passport-image',
    next: '/check-passport-image'
  },
  '/check-passport-image': {
    controller: require('./controllers/check-passport-image'),
    fields: [
      'check-passport-image'
    ],
    template: 'check-passport-image',
    next: '/complete'
  },
  '/complete': {
    controller: require('./controllers/complete'),
    template: 'complete'
  }
};
