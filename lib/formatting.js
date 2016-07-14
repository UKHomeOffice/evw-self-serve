const moment = require('moment');

const getTime = (values, key) => {
  return moment(
    `${values[key + '-hours']}:${values[key + '-minutes']}`, 'HH:mm'
  ).format('HH:mm');
}

const getDate = (values, key) => {
  return moment(`${values[key + '-day']}-${values[key + '-month']}-${values[key + '-year']}`, 'DD-MM-YYYY').format('DD-MM-YYYY');
}

module.exports = {
  getTime: getTime,
  getDate: getDate
}