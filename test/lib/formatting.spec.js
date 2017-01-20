'use strict';

const formatting = require('../../lib/formatting');

describe('lib/formatting', function() {

  it('should export things', function() {
    formatting.getDate.should.be.a.function;
    formatting.getFormattedDate.should.be.a.function;
    formatting.getTime.should.be.a.function;
  });

  describe('#getDate', function() {
    let values;
    let key;

    beforeEach(function() {
      values = {
        'my-date': '',
        'my-date-day': '',
        'my-date-month': '',
        'my-date-year': ''
      };
      key = 'my-date';
    });

    describe('invalid dates', function() {
      it('should handle empty date fields', function() {
        formatting.getDate(values, key).should.equal('');
      });

      it('should handle empty day field', function() {
        values['my-date-month'] = '12';
        values['my-date-year'] = '2016';
        formatting.getDate(values, key).should.equal('');
      });

      it('should handle empty month field', function() {
        values['my-date-day'] = '10';
        values['my-date-year'] = '2016';
        formatting.getDate(values, key).should.equal('');
      });

      it('should handle empty year field', function() {
        values['my-date-day'] = '10';
        values['my-date-month'] = '12';
        formatting.getDate(values, key).should.equal('');
      });

      it('should set an invalid date so it can be check by HOF validators', function() {
        values['my-date-day'] = '32';
        values['my-date-month'] = '15';
        values['my-date-year'] = '2016';
        formatting.getDate(values, key).should.equal('2016-15-32');
      });
    });

    describe('valid dates', function() {
      beforeEach(function() {
        values['my-date-day'] = '25';
        values['my-date-month'] = '12';
        values['my-date-year'] = '2016';
      });

      it('should return date in default format', function() {
        formatting.getDate(values, key).should.equal('2016-12-25');
      });

      it('should return date in specified format', function() {
        formatting.getDate(values, key).should.equal('2016-12-25');
      });

      it('should correctly pad days and months', function() {
        values['my-date-day'] = '1';
        values['my-date-month'] = '2';
        formatting.getDate(values, key).should.equal('2016-02-01');
      });
    });

  });

  describe('#getFormattedDate', function() {
    it('should handle invalid dates', function() {
      formatting.getFormattedDate('2016-13-32').should.equal('Invalid date');
    });

    it('should return date in the default format', function() {
      formatting.getFormattedDate('2016-12-30').should.equal('30/12/2016');
    });

    it('should return date in the specified format', function() {
      formatting.getFormattedDate('2016-12-30', 'DD-MM-YYYY').should.equal('30-12-2016');
      formatting.getFormattedDate('2016-12-30', 'D MMMM YYYY').should.equal('30 December 2016');
    });
  });

  describe('#getTime', function() {
    let values;
    let key;

    beforeEach(function() {
      values = {
        'my-time': '',
        'my-time-hours': '',
        'my-time-minutes': ''
      };
      key = 'my-time'
    });

    describe('invalid times', function() {
      it('should handle empty time', function() {
        formatting.getTime(values, key).should.equal('');
      });

      it('should handle empty hour field', function() {
        values['my-time-minutes'] = '30';
        formatting.getTime(values, key).should.equal('');
      });

      it('should handle empty minute field', function() {
        values['my-time-hours'] = '22';
        formatting.getTime(values, key).should.equal('');
      });

      it('should set a complete but invalid time, which can be formatted later', function() {
        values['my-time-hours'] = '25';
        values['my-time-minutes'] = '30';
        formatting.getTime(values, key).should.equal('25:30');
      });
    });

    describe('valid times', function() {
      beforeEach(function() {
        values['my-time-hours'] = '13';
        values['my-time-minutes'] = '30';
      });

      it('should return hour and minutes combined', function() {
        formatting.getTime(values, key).should.equal('13:30');
      });
    });
  });

  describe('#getFormattedTime', function() {
    it('should pass through invalid times', function() {
      formatting.getFormattedTime('23:60').should.equal('Invalid date');
    });

    it('should return time in the default format', function() {
      formatting.getFormattedTime('12:31').should.equal('12:31');
    });

    it('should return date in the specified format', function() {
      formatting.getFormattedTime('14:45', 'HH:mm:ss').should.equal('14:45:00');
      formatting.getFormattedTime('14:45', 'hh:mm').should.equal('02:45');
      formatting.getFormattedTime('14:45', 'hh:mm:ss').should.equal('02:45:00');
    });
  });
});
