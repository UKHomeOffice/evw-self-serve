'use strict';

const moment = require('moment');

const momentous = (quantity,  direction) => {
  let action = direction === 'future' ? 'add' : 'subtract';
  let times = quantity.split(' ');
  let amount = Number(times[0]);
  let unit = times[1].slice(0,-1); //day/s month/s

  return moment()[action](amount, unit).format('DD/MM/YYYY'); // e.g. moment().add(2, 'months')
};

const pullDate = (string) => {
  let matches = string.match(/^\${"([^"]*)" in the "([^"]*)"}$/);

  if(!matches) {
    return string;
  }

  let quantity = matches[1]; // "2 months"
  let direction = matches[2]; // "future" / "past"

  return momentous(quantity, direction)
};

const d = (s) => pullDate(s);

module.exports = function () {

    this.Then(/^the "([^"]*)" table should contain$/, function (id, strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText(`#${id}`, d(string.trim()));
        }, this);
    });

};

