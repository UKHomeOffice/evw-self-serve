'use strict';

module.exports = function () {

    this.Then(/^the reference number should be present$/, function () {
        this.getText('.header-notice-complete #referenceId', function (ref) {
          this.assert.equal(ref.value.length, 8);
        });
    });

};

