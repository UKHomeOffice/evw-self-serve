'use strict';

const formatting = require('../../lib/formatting');
let values = {
    'departure-date': '10-10-2016',
    'departure-date-day': '10',
    'departure-date-month': '10',
    'departure-date-year': '2016',
    'departure-time': '',
    'departure-time-hours': '2',
    'departure-time-minutes': '1'
};

describe('lib/formatting', function () {
  describe('#getTime', function () {
    it('pads numbers', function () {
      formatting.getTime(values, 'departure-time')
      .should.equal('02:01');
    });

    it('maintains padding', function () {
      values['departure-time-hours'] = '02';
      formatting.getTime(values, 'departure-time')
      .should.equal('02:01');
    });

    it('does not accept blank values', function () {
      values['departure-time-hours'] = '';
      values['departure-time-minutes'] = '';
      formatting.getTime(values, 'departure-time')
      .should.equal('Invalid date');
    });

    it('derives 00mins when hour passed', function () {
      values['departure-time-hours'] = '18';
      values['departure-time-minutes'] = '';
      formatting.getTime(values, 'departure-time')
      .should.equal('18:00');
    });
  });
});