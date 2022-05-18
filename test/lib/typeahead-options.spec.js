'use strict';

const _ = require('lodash');
const typeaheadOptions = require('../../lib/typeahead-options');

describe('lib/typeahead-options', function() {

  describe('#britishAirports', function() {
    it('returns an array', function() {
      typeaheadOptions.britishAirports().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const britishAirports = typeaheadOptions.britishAirports();
      typeaheadOptions.britishAirports().shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const britishAirports = typeaheadOptions.britishAirports({ prependEmpty: false });
      britishAirports.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns British airports only', function() {
      const britishAirports = typeaheadOptions.britishAirports();
      _.find(britishAirports, { value: 'LGW_London Gatwick Airport' }).value.should.equal('LGW_London Gatwick Airport');
      should.equal(undefined, _.find(britishAirports, { value: 'LAX_Los Angeles International Airport' }));
    });
  });

  describe('#nonBritishAirports', function() {
    it('returns an array', function() {
      typeaheadOptions.nonBritishAirports().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const nonBritishAirports = typeaheadOptions.nonBritishAirports();
      nonBritishAirports.shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const nonBritishAirports = typeaheadOptions.nonBritishAirports({ prependEmpty: false });
      nonBritishAirports.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns non-British airports only', function() {
      const nonBritishAirports = typeaheadOptions.nonBritishAirports();
      _.find(nonBritishAirports, { value: 'LAX_Los Angeles International Airport' }).value.should.equal('LAX_Los Angeles International Airport');
      should.equal(undefined, _.find(nonBritishAirports, { value: 'LGW_London Gatwick Airport' }));
    });
  });

  describe('#britishStations', function() {
    it('returns an array', function() {
      typeaheadOptions.britishStations().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const britishStations = typeaheadOptions.britishStations();
      britishStations.should.have.lengthOf(17);
      typeaheadOptions.britishStations().shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const britishStations = typeaheadOptions.britishStations({ prependEmpty: false });
      britishStations.should.have.lengthOf(16);
      britishStations.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns British airports only', function() {
      const britishStations = typeaheadOptions.britishStations();
      _.find(britishStations, { value: 'STP_London (St Pancras Intl)' }).value.should.equal('STP_London (St Pancras Intl)');
      should.equal(undefined, _.find(britishStations, { value: 'COQ_Calais (Coquelles)' }));
    });
  });

  describe('#nonBritishStations', function() {
    it('returns an array', function() {
      typeaheadOptions.nonBritishStations().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const nonBritishStations = typeaheadOptions.nonBritishStations();
      nonBritishStations.should.have.lengthOf(37);
      nonBritishStations.shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const nonBritishStations = typeaheadOptions.nonBritishStations({ prependEmpty: false });
      nonBritishStations.should.have.lengthOf(36);
      nonBritishStations.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns non-British stations only', function() {
      const nonBritishStations = typeaheadOptions.nonBritishStations();
      _.find(nonBritishStations, { value: 'COQ_Calais (Coquelles)' }).value.should.equal('COQ_Calais (Coquelles)');
      should.equal(undefined, _.find(nonBritishStations, { value: 'STP_London (St Pancras Intl)' }));
    });
  });

  describe('#nationalities', function() {
    it('returns an array', function() {
      typeaheadOptions.nationalities().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const nationalities = typeaheadOptions.nationalities();
      nationalities.should.have.lengthOf(213);
      nationalities.shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const nationalities = typeaheadOptions.nationalities({ prependEmpty: false });
      nationalities.should.have.lengthOf(212);
      nationalities.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });
  });


  describe('#britishPorts', function() {
    it('returns an array', function() {
      typeaheadOptions.britishPorts().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const britishAirports = typeaheadOptions.britishPorts();
      britishAirports.should.have.lengthOf(218);
      typeaheadOptions.britishPorts().shift().should.deep.equal({
        label: '',
        value: ''
      });
    });

    it('does not prepend blank entry', function() {
      const britishPorts = typeaheadOptions.britishPorts({ prependEmpty: false });
      britishPorts.should.have.lengthOf(217);
      britishPorts.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns British ports only', function() {
      const britishPorts = typeaheadOptions.britishPorts();
      _.find(britishPorts, { value: 'DOV_DOVER' }).value.should.equal('DOV_DOVER');
      should.equal(undefined, _.find(britishPorts, { value: 'JCT_Calais Passenger' }));
    });
  });

  describe('#nonBritishPorts', function() {
    it('returns an array', function() {
      typeaheadOptions.nonBritishPorts().should.be.an.array;
    });

    it('prepends blank entry', function() {
      const nonBritishPorts = typeaheadOptions.nonBritishPorts();
      nonBritishPorts.should.have.lengthOf(6);
      nonBritishPorts.shift().should.deep.equal({
        label: '',
        value: ''
      });
    });


    it('does not prepend blank entry', function() {
      const nonBritishPorts = typeaheadOptions.nonBritishPorts({ prependEmpty: false });
      nonBritishPorts.should.have.lengthOf(5);
      nonBritishPorts.shift().should.not.deep.equal({
        label: '',
        value: ''
      });
    });

    it('returns non-British ports only', function() {
      const nonBritishPorts = typeaheadOptions.nonBritishPorts();
      _.find(nonBritishPorts, { value: 'JCT_Calais Passenger' }).value.should.equal('JCT_Calais Passenger');
      should.equal(undefined, _.find(nonBritishPorts, { value: 'DOV_DOVER' }));
    });
  });

  describe('allAirports', function() {
    it('returns an array of all airports', function() {
      typeaheadOptions.allAirports.should.be.an.array;
      _.find(typeaheadOptions.allAirports, { code: 'LGW' }).name.should.equal('London Gatwick Airport');
      _.find(typeaheadOptions.allAirports, { code: 'LAX' }).name.should.equal('Los Angeles International Airport');
    });
  });

  describe('allStations', function() {
    it('returns an array of all stations', function() {
      typeaheadOptions.allStations.should.be.an.array;
      typeaheadOptions.allStations.should.be.lengthOf(52);
    });
  });

  describe('allPorts', function() {
    it('returns an array of all stations', function() {
      typeaheadOptions.allPorts.should.be.an.array;
      typeaheadOptions.allPorts.should.be.lengthOf(222);
    });
  });

  describe('allCountries', function() {
    it('returns an array of all stations', function() {
      typeaheadOptions.allCountries.should.be.an.array;
      typeaheadOptions.allCountries.should.be.lengthOf(212);
    });
  });

});
