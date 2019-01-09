'use strict';

var path = require('path');
var express = require('express');
var app = express();
var logger = require('./lib/logger');
var churchill = require('churchill');


var config = require('./config');
require('moment-business');

if (config.env !== 'ci') {
  app.use(churchill(logger));
}

app.use(function setGaCode(req, res, next) {
  if (config.gaCode) {
    res.locals.gaCode = config.gaCode;
  }
  next();
});

app.use(config.assetPath, express.static(path.resolve(__dirname, './public')));

app.use(function setAssetPath(req, res, next) {
  res.locals.assetPath = config.assetPath;
  next();
});

require('hof').template.setup(app, {
    path: config.govukAssetPath
});
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, './apps/common/views'));
app.enable('view cache');
app.use(require('express-partial-templates')(app));
app.engine('html', require('hogan-express-strict'));

app.use(require('./middleware/additional-hof-template-mixins')());

app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());

app.use(function setBaseUrl(req, res, next) {
  res.locals.baseUrl = req.baseUrl;
  next();
});

// Trust proxy for secure cookies
app.set('trust proxy', 1);

function secureCookies(req, res, next) {
  var cookie = res.cookie.bind(res);
  res.cookie = function cookieHandler(name, value, options) {
    options = options || {};
    options.secure = (req.protocol === 'https');
    options.httpOnly = true;
    options.path = '/';
    cookie(name, value, options);
  };
  next();
}

app.use(require('cookie-parser')(config.session.secret));
app.use(secureCookies);

// Mongo session
//const mongoSession = require('./lib/session/mongo')(config);
//app.use(mongoSession);

// kubernetes monitoring and metrics endpoints
app.use(require('rtp-monitoring-metrics'));

app.get('/cookies', function renderCookies(req, res) {
  res.render('cookies');
});

app.get('/terms-and-conditions', function renderTerms(req, res) {
  res.render('terms');
});

app.get([
  '/shared/healthcheck/version',
  '/healthcheck/version',
  '/version'
  ], (req, res) => {
  let version = require('fs').readFileSync(__dirname + '/version', 'utf8');
  res.json({
    'application': config.appName,
    'version': version
  })
});

// use the hof middleware
app.use(require('hof').middleware.cookies());

// apps
app.use(require('./apps/find-your-application/'));
app.use(require('./apps/update-journey-details/'));

app.use(require('./middleware/not-found')());

// errors
app.use(require('./errors/'));

/*eslint camelcase: 0*/
app.listen(config.port, config.listen_host);
/*eslint camelcase: 1*/
logger.info('App listening on port', config.port);
