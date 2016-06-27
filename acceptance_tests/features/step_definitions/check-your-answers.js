'use strict';

module.exports = function () {

    this.Then(/^the summary table should contain$/, function (strings) {
        strings.split(/\n/).forEach( function (string) {
            this.assert.containsText('#summary', string);
        }, this);
    });

};

