'use strict';

const initTypeahead = require('../../../assets/js/typeahead/init-typeahead');

const chai = require('chai');
const should = chai.should;


describe('init typeahead', function () {
  
  it('exports a function', function () {
    initTypeahead.should.be.a.function;
  })
  
});