'use strict';

var $ = require('jquery');

function onPassportImageUploadPage() {
  return !!$('#passport-image-group').length;
}

function showLabel() {
  $('#passport-image-group label').removeClass('visuallyhidden');
}

function enableLabel() {
  var $passportImage = $('#passport-image-group input');

  $('#passport-image-group label')
    .attr('role', 'button')
    .attr('aria-controls', $passportImage.attr('id'))
    .attr('tabindex', '0')
    .bind('keypress keyup', function passportImageKeyPress(e) {
      // handle space bar and enter
      if (e.which === 32 || e.which === 13) {
        e.preventDefault();
        $passportImage.click();
      }
    });

  $passportImage.on('change', function changeEventHandler(e) {
    if (e.target.name === $passportImage.attr('name')) {
      $('#continue').click();
    }
  });
}

function hideFilePicker() {
  $('#passport-image-group input').hide();
}

function hideContinueButton() {
  $('#continue').hide();
}

function setupPassportImageUpload() {
  if (!onPassportImageUploadPage()) {
    return;
  }
  showLabel();
  hideFilePicker();
  enableLabel();
  hideContinueButton();
}

module.exports = {
  setupPassportImageUpload: setupPassportImageUpload
};
