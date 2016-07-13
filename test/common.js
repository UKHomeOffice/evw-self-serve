'use strict';

global.chai = require('chai')
    .use(require('sinon-chai'))
    .use(require('chai-as-promised'));
global.should = chai.should();
global.sinon = require('sinon');
require('sinomocha')();
require('moment-business');

// bring up evw-integration-stub
require('evw-integration-stub')();

process.env.NODE_ENV = 'test';
process.setMaxListeners(0);
process.stdout.setMaxListeners(0);
