const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('../../config');

module.exports = (config) => {
  let options = {
    url: config.mongo.connectionString,
  };

  if (config.mongo.sslEnabled) {
    const ca = [fs.readFileSync('/etc/ssl/certs/ca-certificates.crt')];
    const cert = fs.readFileSync('/mnt/certs/tls.pem');
    const key = fs.readFileSync('/mnt/certs/tls-key.pem');
    options.sslCA = ca;
    options.sslCert = cert;
    options.sslKey = key;
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
