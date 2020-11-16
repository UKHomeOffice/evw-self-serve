'use strict';

var $ = require('jquery');
var autocomplete = require('accessible-autocomplete');

module.exports = function initAutocomplete() {
  var selects = $('select.autocomplete');
  selects.each(function(index, element){
    autocomplete.enhanceSelectElement({
      selectElement: document.querySelector('#' + $(element).attr('id'))
    })
  });
};