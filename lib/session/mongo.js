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
      sslCA: fs.readFileSync(config.mongo.sslCA),
      sslCert: fs.readFileSync(config.mongo.sslCert),
      sslKey: fs.readFileSync(config.mongo.sslKey),
      ssl: true,
      sslValidate: false
    }
  }

  return session({
    name: config.session.name,
    secret: config.session.secret,
    ttl: config.session.ttl,
    resave: true,
    saveUninitialized: true,
    cookie: {
      name: config.session.name,
      secure: (
        config.env === 'development' ||
        config.env === 'ci'
      ) ? false : true
    },
    store: new MongoStore(options)
  });
};
