'use strict';

const moment = require('moment');

const getTime = (values, key) => {
  let time = moment(
    `${values[key + '-hours']}:${values[key + '-minutes']}`, 'HH:mm'
  ).format('HH:mm');
  if (`${values[key + '-hours']}${values[key + '-minutes']}` === '') {
   time = '';
  }
  return time;
}

const getDate = (values, key) => {
  return moment(`${values[key + '-day']}-${values[key + '-month']}-${values[key + '-year']}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
}

const setDateTimes = (values, key) => {
  if(key.match(/dob$|date$/gi) ) {
    return getDate(values, key);
  }

  if (key.indexOf('time') > -1) {
    return getTime(values, key);
  }

  return values[key];
};

module.exports = {
  getTime: getTime,
  getDate: getDate,
  setDateTimes: setDateTimes
}