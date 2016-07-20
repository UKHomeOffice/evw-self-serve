'use strict';

module.exports = function () {

    this.Then(/^the reference number should be present$/, function () {
        this.getText('.header-notice-complete #referenceId', function (ref) {
          let referenceThere = ref.value.length > 7;
          this.assert.equal(referenceThere, true);
        });
    });

};
