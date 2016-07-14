const moment = require('moment');

const getTime = (values, key) => {
  return moment(
    `${values[key + '-hours']}:${values[key + '-minutes']}`, 'HH:mm'
  ).format('HH:mm');
}

module.exports = {
  getTime: getTime
}