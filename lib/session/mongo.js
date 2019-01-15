const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const fs = require('fs');


module.exports = (config) => {
  let options = {
    url: config.mongo.connectionString,
  };
  console.log(config.mongo.connectionString);

  if (config.mongo.sslEnabled) {
    options.mongoOptions = {
      sslCA: config.mongo.sslCA,
      sslCert: config.mongo.sslCert,
      sslKey: config.mongo.sslKey,
      sslValidate: false
    }
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
