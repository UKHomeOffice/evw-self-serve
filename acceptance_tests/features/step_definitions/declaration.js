'use strict';

module.exports = function () {

    this.Then(/^the new EVW warning should be present$/, function () {
        this.assert.elementPresent('[data-test="new-evw-warning"]');
    });

    this.Then(/^the new EVW warning should not be present$/, function () {
        this.assert.elementNotPresent('[data-test="new-evw-warning"]');
    });

};
