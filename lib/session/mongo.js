const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

module.exports = (config) => {
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
    store: new MongoStore({
      url: config.mongo.connectionString,
      ttl: config.session.ttl
    })
  });
};
