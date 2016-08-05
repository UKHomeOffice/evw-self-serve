const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = (config) => {
  return session({
    secret: config.session.secret,
    ttl: config.session.ttl,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({
      url: config.mongo.connectionString,
    })
  });
};
