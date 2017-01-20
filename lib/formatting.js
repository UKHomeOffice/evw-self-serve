'use strict';

const moment = require('moment');

function getTime(values, key) {
  const hour = `${values[key + '-hours']}`;
  const minute = `${values[key + '-minutes']}`;
  return (hour !== '' && minute !== '') ? `${hour}:${minute}` : '';
}

function getFormattedTime(timeString, format) {
  return moment(timeString, 'HH:mm').format(format || 'HH:mm');
}

function getDate(values, key) {
  const pad = function pad(n) {
    return (n.length < 2) ? '0' + n : n;
  };
  const day = `${values[key + '-day']}`;
  const month = `${values[key + '-month']}`;
  const year = `${values[key + '-year']}`;
  return (year !== '' && month !== '' && day !== '') ? `${year}-${pad(month)}-${pad(day)}` : '';
}

function getFormattedDate(dateString, format) {
  return moment(dateString, 'YYYY-MM-DD').format(format || 'DD/MM/YYYY');
}

module.exports = {
  getTime: getTime,
  getFormattedTime: getFormattedTime,
  getDate: getDate,
  getFormattedDate: getFormattedDate
};
