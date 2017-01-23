'use strict';

const jquery = require('jquery');
const jsdom = require('jsdom');

const proxyquire = require('proxyquire');

const chai = require('chai');
const should = chai.should();
const sinon = require('sinon');

describe('The typeahead', function () {

  let typeahead;

  let $;
  let countries = [
    {
      Albania: ''
    },
    {
      Algeria: ''
    },
    {
      Angola: ''
    },
    {
      'Burkina Faso': ''
    }
  ];

  function setup(response) {
    return new Promise(function(resolve) {
      jsdom.env({
        html: response,
        done: function(errors, win) {
          $ = jquery(win);
          global.window = win;
          return resolve(new (proxyquire('../../../assets/js/typeahead/typeahead', {
            'jquery': $
          })));
        }
      });
    });
  }

  before(function() {
    return setup(`<html></html>`)
      .then(function (inst) {
        typeahead = inst;
      });
  });

  describe('#substringMatcher', function() {

    it('returns a function', function () {
      typeahead.substringMatcher.should.be.a.function;
    });

    describe('the returned function', function () {

      it('invokes a callback with the matches', function () {
        let cb = sinon.stub();
        let func = typeahead.substringMatcher(countries);
        func('Al', cb);
        cb.should.have.been.calledWith(['Albania', 'Algeria']);
      });

      it('matches only from the beginning of a string / word', function () {
        let cb = sinon.stub();
        let func = typeahead.substringMatcher(countries);
        func('ban', cb);
        cb.should.have.been.calledWith([]);
        func('fa', cb);
        cb.should.have.been.calledWith(['Burkina Faso']);
      });

      it('matches in a case insensitive way', function () {
        let cb = sinon.stub();
        let func = typeahead.substringMatcher(countries);
        func('aL', cb);
        cb.should.have.been.calledWith(['Albania', 'Algeria']);
      });

      it('matches the start of the word preceeded by a bracket', function () {
        let cb = sinon.stub();
        let func = typeahead.substringMatcher([
          {
            'Paris (gare du nord)': ''
          },
          {
            'Bruxelles gare du midi': ''
          },
          {
            'Gare de Paris St Lazare': ''
          },
          {
            'Egaray sur Marne': ''
          }
        ]);
        func('Gar', cb);
        cb.should.have.been.calledWith(['Paris (gare du nord)', 'Bruxelles gare du midi', 'Gare de Paris St Lazare']);
      })

    })

  });
  
  describe('#readValues', function () {

    before(function() {
      return setup(`<html>
                        <select id="alphabet">
                            <option value="a">First letter</option>
                            <option value="b">Second letter</option>
                            <option value="c">You may begin to see a pattern there</option>
                        </select>
                    </html>`)
        .then(function (inst) {
          typeahead = inst;
        });
    });

    it('returns an array', function () {
      typeahead.readValues().should.be.an.array;
    });

    it('should contain the values of the select passed to it as a dom element', function () {
      let sel = $('#alphabet')[0];
      let result = typeahead.readValues(sel);
      result.should.be.an.array;
      result.should.deep.equal([
        {
          'First letter': {
            value: 'a'
          }
        }, {
          'Second letter': {
            value: 'b'
          }
        }, {
          'You may begin to see a pattern there': {
            value: 'c'
          }
        }
      ])
    });
  });
  
  describe('#readExistingValue', function () {
    before(function() {
      return setup(`<html>
                        <select id="alphabet">
                            <option value="">Choose a letter</option>
                            <option value="a">First letter</option>
                            <option value="b" selected>Second letter</option>
                            <option value="c">You may begin to see a pattern there</option>
                        </select>
                    </html>`)
        .then(function (inst) {
          typeahead = inst;
        });
    });

    it('returns the selected value', function () {
      typeahead.readExistingValue('#alphabet', [
        {
          'First letter': {
            value: 'a'
          }
        }, {
          'Second letter': {
            value: 'b'
          }
        }
      ]).should.deep.equal({
        key: 'Second letter',
        value: 'b'
      })
    });

    it('returns null if nothing is selected', function () {
      $('#alphabet').val('');
      let result = typeahead.readExistingValue('#alphabet', [
        {
          'First letter': {
            value: 'a'
          }
        }, {
          'Second letter': {
            value: 'b'
          }
        }
      ]);
      should.equal(result, null);
    });
  });

  describe('#createElementForTypeahead', function () {

    before(function() {
      return setup(`<html>
                        <select id="cakes" data-typeahead-maxlength="40">
                            <option value="">Choose a cake</option>
                            <option value="t">Tiramisu</option>
                            <option value="p" selected>Pannacotta</option>
                        </select>
                    </html>`)
        .then(function (inst) {
          typeahead = inst;
          typeahead.id = 'cakes_typeahead';
          typeahead.originalId = 'cakes';
        });
    });

    it('copies the value of data-typeahead-maxlength from the original select', function () {
      var str = typeahead.createElementForTypeahead();
      typeahead.replaceElement($('#' +  typeahead.originalId), str);
      var newEl = $('#' + typeahead.id);
      newEl.length.should.exist;
      newEl.length.should.not.equal(0);
      newEl.attr('maxlength').should.exist;
      newEl.attr('maxlength').should.equal('40');
    });

  });

  describe('#onSubmit', function () {

    before(function() {
      return setup(`<html>
                        <input id="alphabet_typeahead" value="First letter">
                        <input type="hidden" id="alphabet">
                    </html>`)
        .then(function (inst) {
          typeahead = inst;
          typeahead.id = 'alphabet_typeahead';
          typeahead.originalId = 'alphabet';
          $('#alphabet_typeahead').data('suggestions', [
            {
              'First letter': {
                value: 'a'
              }
            }, {
              'Second letter': {
                value: 'b'
              }
            }
          ]);
        });
    });

    it('copies into the hidden field the matching value of the user choice', function () {
      typeahead.onSubmit();
      $('#alphabet').val().should.equal('a');
    });

    it('if no matching values among the suggestions, it copies the exact value', function () {
      $('#alphabet_typeahead').val('Third letter');
      typeahead.onSubmit();
      $('#alphabet').val().should.equal('Third letter');
    });
  });
});