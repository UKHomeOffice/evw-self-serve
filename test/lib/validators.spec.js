'use strict';

const validators = require('../../lib/validators');
const moment = require('moment');

describe('custom validators', function () {
  describe('beforeDate', function () {
    describe('value is before limit', function () {
      it('returns true', function () {
        const value = '1901-01-01';
        const limit = '1999-01-01';
        validators.beforeDate(value, limit).should.be.true;
      });
    });
    describe('value is after limit', function () {
      it('returns false', function () {
        const value = '2001-11-01';
        const limit = '1909-01-21';
        validators.beforeDate(value, limit).should.be.false;
      });
    });
    describe('value === limit', function () {
      it('returns false', function () {
        const value = '2001-11-01';
        const limit = '2001-11-01';
        validators.beforeDate(value, limit).should.be.false;
      });
    });
  });

  describe('afterDate', function () {
    describe('value is before limit', function () {
      it('returns true', function () {
        const value = '1901-01-01';
        const limit = '1999-01-01';
        validators.afterDate(value, limit).should.be.false;
      });
    });
    describe('value is after limit', function () {
      it('returns false', function () {
        const value = '2001-11-01';
        const limit = '1909-01-21';
        validators.afterDate(value, limit).should.be.true;
      });
    });
    describe('value === limit', function () {
      it('returns false', function () {
        const value = '2001-11-01';
        const limit = '2001-11-01';
        validators.afterDate(value, limit).should.be.false;
      });
    });
  });

  describe('validTime', function () {
    describe('value is a time string', function () {
      it('returns false', function () {
        const value = '12:24';
        validators.validTime(value).should.be.false;
      });
    });
    describe('value is "Invalid date"', function () {
      it('returns true', function () {
        const value = 'Invalid date';
        validators.validTime(value).should.be.true;
      });
    });
  });

  describe('validateDepartureDate', function() {
    it('returns false if there are no issues with the departure date', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment().add(5, 'days').subtract(6, 'hours');
      validators.validateDepartureDate(arrival, departure).should.be.false;
    });

    it('validates that departure should not be after arrival', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment().add(5, 'days').add(1, 'minute');
      validators.validateDepartureDate(arrival, departure).should.equal('depart-after-arrive');
    });

    it('validates that departure should not be after arrival, allowing for time travel', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment().add(5, 'days').add(45, 'minutes');
      validators.validateDepartureDate(arrival, departure, true).should.be.false;
    });

    it('validates that departure should be within 24 hours of arrival', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment().add(5, 'days').subtract(25, 'hours');
      validators.validateDepartureDate(arrival, departure).should.equal('depart-24-hours-before-arrive');
    });

    it('validates that departure should be more than 48 hours from now', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment().add(47, 'hours');
      validators.validateDepartureDate(arrival, departure).should.equal('travel-too-soon');
    });

    it('returns false if departure date time is invalid', function() {
      const arrival = moment().add(5, 'days');
      const departure = moment('2017-02-29 12:00', 'YYYY-MM-DD HH:mm');
      validators.validateDepartureDate(arrival, departure).should.be.false;
    });

    it('returns false if arrival date time is invalid', function() {
      const arrival = moment('2017-02-29 12:00', 'YYYY-MM-DD HH:mm');
      const departure = moment().add(5, 'days');
      validators.validateDepartureDate(arrival, departure).should.be.false;
    });
  });
});
