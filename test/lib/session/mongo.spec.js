'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const mockConfig = {
  session: {
    name: 'sessionName',
    secret: 'ohsosecret',
    ttl: 5000
  },
  mongo: {
    port: 27017,
    host: 'localhost',
    connectionString: 'mongodb://notarealdatabase:27016',
    ttl: 5000
    sslEnabled: true,
    sslCA:   'ca-certificates.crt',
    sslCert: 'evw_test.pem',
    sslKey: 'evw_test.key'
  }
};

let sessionStub = sinon.stub();
let mongoStoreStub = sinon.stub();
let mongoSession;
const fs = require('fs');

describe('session/mongo', function() {
  before(function() {
    mongoSession = proxyquire('../../../lib/session/mongo', {
      'express-session': sessionStub,
      'connect-mongo': sinon.stub().withArgs(sessionStub).returns(mongoStoreStub)
    });
    mongoSession(mockConfig);
  });

  it('creates a session with a mongo store', function() {
    mongoStoreStub.should.have.been.calledWith({
      url: mockConfig.mongo.connectionString,
      ttl: 5000
      mongoOptions: {
        sslCA: fs.readFileSync('ca-certificates.crt'),
        sslCert: fs.readFileSync('evw_test.pem'),
        sslKey: fs.readFileSync('evw_test.key'),
        ssl: true,
        sslValidate: false
      }
    });
  });

  it('session is called with config options', function() {
    sessionStub.should.have.been.calledWith({
      name: 'sessionName',
      secret: 'ohsosecret',
      ttl: 5000,
      cookie: {
        name: "sessionName",
        secure: true
      },
      resave: true,
      saveUninitialized: true,
      store: {},
    });
  });
});
