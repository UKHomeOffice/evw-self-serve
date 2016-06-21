module.exports = function () {

    this.Then(/^the page content should contain "([^"]*)"$/, function (string) {
        this.assert.containsText('.grid-row p', string);
    });

};
