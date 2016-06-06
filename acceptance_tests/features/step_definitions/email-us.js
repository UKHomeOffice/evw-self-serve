'use strict';

module.exports = function () {

    this.Then(/^the need to know list should contain$/, function (strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('ul.list', string);
        }, this);
    });

};

