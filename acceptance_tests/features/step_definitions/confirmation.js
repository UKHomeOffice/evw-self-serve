'use strict';

module.exports = function () {

    this.Then(/^the reference number should be present$/, function () {
        this.getText('.header-notice-complete #referenceId', function (ref) {
          let referenceThere = ref.value.length > 7;
          this.assert.equal(referenceThere, true);
        });
    });

    this.Then(/^the user is told they will receive a new EVW$/, function () {
        this.assert.visible('[data-test="new-evw"]');
    });

    this.Then(/^the user is told their EVW details will be changed$/, function () {
        this.assert.visible('[data-test="no-new-evw"]');
    });

};
