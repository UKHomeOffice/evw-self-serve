'use strict';

const moment = require('moment');
const afterDate = require('../../../lib/validators').afterDate;
const beforeDate = require('../../../lib/validators').beforeDate;

module.exports = {
  'travel-details-changed': {
    validate: ['required'],
    className: ['form-group'],
    legend: {
      className: 'visuallyhidden'
    },
    options: [{
      value: 'Yes',
      label: 'fields.travel-details-changed.options.yes.label',
      toggle: 'travel-details-changed-yes-div'
    }, {
      value: 'No',
      label: 'fields.travel-details-changed.options.no.label',
      toggle: 'travel-details-changed-no-div'
    }]
  },
  'uk-duration': {
    validate: ['required'],
    className: ['form-group'],
    options: [{
      value: 'Less than 1 month',
      label: 'fields.uk-duration.options.less-than-one-month.label'
    }, {
      value: '1 to 3 months',
      label: 'fields.uk-duration.options.one-to-three-months.label'
    }, {
      value: '3 to 6 months',
      label: 'fields.uk-duration.options.three-to-six-months.label'
    }],
    dependent: {
      field: 'travel-details-changed',
      value: 'No'
    }
  },
  'uk-departure-travel-number': {
    validate: ['required', {type: 'maxlength', arguments: '30'}],
    dependent: {
      field: 'travel-details-changed',
      value: 'Yes'
    }
  },
  'uk-date-of-departure': {
    validate: ['required', 'date'],
    validators: [{
      type: beforeDate,
      arguments: moment().add(48, 'hours').format('YYYY-MM-DD')
    }, {
      type: afterDate,
      arguments: moment().add(6, 'months').format('YYYY-MM-DD')
    }],
    dependent: {
      field: 'travel-details-changed',
      value: 'Yes'
    }
  },
  'uk-date-of-departure-day': {
    label: 'fields.uk-date-of-departure-day.label'
  },
  'uk-date-of-departure-month': {
    label: 'fields.uk-date-of-departure-month.label'
  },
  'uk-date-of-departure-year': {
    label: 'fields.uk-date-of-departure-year.label'
  },
  'uk-port-of-departure': {
    validate: ['required', {type: 'maxlength', arguments: '95'}],
    className: ['form-group'],
    options: [{
      label: '',
      value: ''
    }, {
      value: 'LGW',
      label: 'London - Gatwick'
    }],
    dependent: {
      field: 'travel-details-changed',
      value: 'Yes'
    }
  }
};
