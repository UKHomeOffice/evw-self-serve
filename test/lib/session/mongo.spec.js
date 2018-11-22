'use strict';

const proxyquire = require('proxyquire').noPreserveCache();
const mockConfig = {
  session: {
    secret: 'ohsosecret',
    ttl: 5000
  },
  mongo: {
    port: 27017,
    host: 'localhost',
    connectionString: 'mongodb://notarealdatabase:27016',
    ttl: 5000
  }
};

let sessionStub = sinon.stub();
let mongoStoreStub = sinon.stub();
let mongoSession;

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
    });
  });

  it('session is called with config options', function() {
    sessionStub.should.have.been.calledWith({
      secret: 'ohsosecret',
      ttl: 5000,
      cookie: {
        secure: true
      },
      resave: true,
      saveUninitialized: true,
      store: {},
    });
  });
});