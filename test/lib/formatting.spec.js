'use strict';

const formatting = require('../../lib/formatting');
let values = {
    'departure-date': '',
    'departure-date-day': '24',
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

  describe('#getDate', function () {
    it('formats as DD-MM-YYYY', function () {
      formatting.getDate(values, 'departure-date')
      .should.equal('24-10-2016');
    });

    it('pads to DD-MM-YYYY', function () {
      values['departure-date-day'] = '2'
      values['departure-date-month'] = '3'
      values['departure-date-year'] = '16'
      formatting.getDate(values, 'departure-date')
      .should.equal('02-03-2016');
    });
  });
});