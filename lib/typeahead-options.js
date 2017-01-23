'use strict';

const _ = require('lodash');
const allAirports = require('../data/airports.json');
const allStations = require('../data/stations.json');
const allPorts = require('../data/ports.json');
const allCountries = require('../data/nationalities.json');

function getTypeaheadValue(value, typeaheadData) {
  if (!value || value === '') {
    return null;
  }
  const result = _.find(typeaheadData, {'code': value});
  return (result && result.name) ? result.name : value;
}

function mapListEntries(list) {
  return list.map(entry => {
    return {
      label: entry.name,
      value: entry.code
    };
  });
}

function addPrependedEmptyOption(list) {
  list.unshift({
    label: '',
    value: ''
  });
  return list;
}

function nationalities(options) {
  const opts = options || {prependEmpty: true};
  let allNationalities = mapListEntries(require('../data/nationalities.json'));
  return opts.prependEmpty ? addPrependedEmptyOption(allNationalities) : allNationalities;
}

function britishAirports(options) {
  const opts = options || {prependEmpty: true};
  let airports = mapListEntries(allAirports.filter(airport => airport['country-code'] === 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(airports) : airports;
}

function nonBritishAirports(options) {
  const opts = options || {prependEmpty: true};
  let airports = mapListEntries(allAirports.filter(airport => airport['country-code'] !== 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(airports) : airports;
}

function britishPorts(options) {
  const opts = options || {prependEmpty: true};
  let ports = mapListEntries(allPorts.filter(port => port['country-code'] === 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(ports) : ports;
}

function nonBritishPorts(options) {
  const opts = options || {prependEmpty: true};
  let ports = mapListEntries(allPorts.filter(port => port['country-code'] !== 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(ports) : ports;
}

function britishStations(options) {
  const opts = options || {prependEmpty: true};
  let stations = mapListEntries(allStations.filter(station => station['country-code'] === 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(stations) : stations;
}

function nonBritishStations(options) {
  const opts = options || {prependEmpty: true};
  let stations = mapListEntries(allStations.filter(station => station['country-code'] !== 'GBR'));
  return opts.prependEmpty ? addPrependedEmptyOption(stations) : stations;
}

module.exports = {
  nationalities: nationalities,
  britishAirports: britishAirports,
  nonBritishAirports: nonBritishAirports,
  britishPorts: britishPorts,
  nonBritishPorts: nonBritishPorts,
  britishStations: britishStations,
  nonBritishStations: nonBritishStations,
  getTypeaheadValue: getTypeaheadValue,
  allAirports: allAirports,
  allStations: allStations,
  allPorts: allPorts,
  allCountries: allCountries,
  all: allAirports.concat(allStations).concat(allPorts)
};
