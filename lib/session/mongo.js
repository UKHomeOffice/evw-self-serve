const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');


module.exports = (config) => {
  let options = {
    url: config.mongo.connectionString,
  };

  if (config.mongo.sslEnabled) {
    options.sslCA = config.mongo.sslCA;
    options.sslCert = config.mongo.sslCert;
    options.sslKey = config.mongo.sslKey;
    options.sslValidate = false;
  }

  return session({
    secret: config.session.secret,
    ttl: config.session.ttl,
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: (
        config.env === 'development' ||
        config.env === 'ci'
      ) ? false : true
    },
    store: new MongoStore(options)
  });
};
