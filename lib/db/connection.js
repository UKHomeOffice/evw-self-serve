'use strict';

/* This code has been pulled in from mongo-node. The idea here was to avoid using it.
 * So I pulled the connection part in for now whilst we think about what we may do instead.
 * At this point, all this is used for is creating a connection for the passport image upload.
 */

var fs = require('fs');
var MongoClient = require('mongodb').MongoClient;
var dbSingleton = null;
var config = require('../../config');

var connectionString = config.mongo.connectionString;

/* for replica sets use:
 'mongodb://username:password@host1:27017,host2:27017,host3:27017/dbname?w=1';
 */

function setConnectionString(connString) {
  var at = connString.lastIndexOf('@');
  if (at > 0) {
    var auth = connString.substr(0, at);
    var nodes = connString.substr(at);
    var parts = /([^:]+:[^:]+:)(.+)/.exec(auth);
    connString = parts[1] + encodeURIComponent(parts[2]) + nodes;
  }
  connectionString = connString;
}

function isDatabaseAlive(callback) {
  if (dbSingleton) {
    dbSingleton.listCollections().toArray((err, collections) => {
      callback(err === null && collections !== null);
    });
  } else {
    callback(false);
  }
}

function connect(options, callback) {
  /* eslint-disable camelcase, no-unused-expressions */
  (options.uri_decode_auth === undefined) && (options.uri_decode_auth = true);
  /* eslint-enable camelcase, no-unused-expressions */

  if (config.mongo.sslEnabled) {
    const ca = [fs.readFileSync('/etc/ssl/certs/ca-certificates.crt')];
    const cert = fs.readFileSync('/mnt/certs/tls.pem');
    const key = fs.readFileSync('/mnt/certs/tls-key.pem');
    options.sslCA = ca;
    options.sslCert = cert;
    options.sslKey = key;
    options.sslValidate = false;
  }

  MongoClient.connect(connectionString, options, (err, db) => {
    if (!err) {
      dbSingleton = db;
    }
    callback(err, dbSingleton);
  });

}

function getConnection(options, callback) {
  // options is optional
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  isDatabaseAlive(isAlive => {
    if (isAlive) {
      callback(null, dbSingleton);
    } else {
      dbSingleton = null;
      connect(options, callback);
    }
  });

}

function disconnect(callback) {
  isDatabaseAlive(isAlive => {
    if (isAlive) {
      dbSingleton.close((err, res) => {
        dbSingleton = null;
        callback(err, res);
      });
    } else {
      dbSingleton = null;
      callback(null, true);
    }
  });

}

module.exports = {
  getConnection: getConnection,
  disconnect: disconnect,
  setConnectionString: setConnectionString
};
