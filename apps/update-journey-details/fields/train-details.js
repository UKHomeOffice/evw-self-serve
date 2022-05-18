'use strict';

const moment = require('moment');
const beforeDate = require('../../../lib/validators').beforeDate;
const afterDate = require('../../../lib/validators').afterDate;
const validTime = require('../../../lib/validators').validTime;
const nationalities = require('../../../lib/typeahead-options').nationalities();
const britishStations = require('../../../lib/typeahead-options').britishStations();
const nonBritishStations = require('../../../lib/typeahead-options').nonBritishStations();

module.exports = {
  'train-number': {
    validate: ['required', {type: 'maxlength', arguments: '30'}],
    className: ['form-group']
  },
  'train-departure-date': {
    key: 'train-departure-date',
    validate: ['required', 'date'],
    validators: [{
      type: beforeDate,
      arguments: () => moment().add(48, 'hours').format('YYYY-MM-DD')
    }, {
      type: afterDate,
      arguments: () => moment().add(3, 'months').format('YYYY-MM-DD')
    }],
    legend: {
      className: 'visuallyhidden'
    }
  },
  'train-departure-date-day': {
    label: 'fields.train-departure-date-day.label'
  },
  'train-departure-date-month': {
    label: 'fields.train-departure-date-month.label'
  },
  'train-departure-date-year': {
    label: 'fields.train-departure-date-year.label'
  },
  'train-departure-time': {
    key: 'train-departure-time',
    validate: ['required'],
    validators: [{
      type: validTime
    }],
    legend: {
      className: 'visuallyhidden'
    }
  },
  'train-departure-time-hour': {
    validate: [{type: 'maxlength', arguments: '2'}],
    label: 'fields.train-departure-time-hour.label'
  },
  'train-departure-time-minute': {
    validate: [{type: 'maxlength', arguments: '2'}],
    label: 'fields.train-departure-time-minute.label'
  },
  'train-departure-country': {
    validate: ['required'],
    className: ['autocomplete'],
    options: nationalities
  },
  'train-departure-station': {
    validate: ['required', {type: 'maxlength', arguments: '95'}],
    ignoreValidate: ['equal'],
    className: ['autocomplete'],
    options: nonBritishStations
  },
  'train-arrival-station': {
    validate: ['required'],
    className: ['autocomplete'],
    options: britishStations
  },
  'train-arrival-date': {
    key: 'train-arrival-date',
    validate: ['required', 'date'],
    validators: [{
      type: beforeDate,
      arguments: () => moment().add(48, 'hours').format('YYYY-MM-DD')
    }, {
      type: afterDate,
      arguments: () => moment().add(3, 'months').format('YYYY-MM-DD')
    }],
    legend: {
      className: 'visuallyhidden'
    }
  },
  'train-arrival-date-day': {
    label: 'fields.train-arrival-date-day.label'
  },
  'train-arrival-date-month': {
    label: 'fields.train-arrival-date-month.label'
  },
  'train-arrival-date-year': {
    label: 'fields.train-arrival-date-year.label'
  },
  'train-arrival-time': {
    key: 'train-arrival-time',
    validate: ['required'],
    validators: [{
      type: validTime,
    }],
    legend: {
      className: 'visuallyhidden'
    }
  },
  'train-arrival-time-hour': {
    validate: [{type: 'maxlength', arguments: '2'}],
    label: 'fields.train-arrival-time-hour.label'
  },
  'train-arrival-time-minute': {
    validate: [{type: 'maxlength', arguments: '2'}],
    label: 'fields.train-arrival-time-minute.label'
  }
};
