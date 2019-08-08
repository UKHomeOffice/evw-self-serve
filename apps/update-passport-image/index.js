'use strict';

var hof = require('hof');
var wizard = hof.wizard;
var mixins = hof.mixins;
var i18nFuture = hof.i18n;
var router = require('express').Router();
var path = require('path');
var _ = require('underscore');
var controllers = require('hof').controllers;
var BaseController = controllers.base;
var config = require('../../config');
let templateMixins = require('../../lib/template-mixins');

var fields = _.extend({}, require('../common/fields/'), require('./fields/'));
var i18n = i18nFuture({
  path: path.resolve(__dirname, './translations/__lng__/__ns__.json')
});

router.use(mixins(fields, {
  translate: i18n.translate.bind(i18n),
  viewsDirectory: `${__dirname}/../common/views/`
}));

router.use((req, res, next) => {
  req.fields = fields;
  next();
});

router.use(require('multer')({
  dest: `${__base}/${config.imageUploadDir}`,
  fileFilter: function fileFilter(req, file, next) {
    if (!file.mimetype || config.validImageTypes.indexOf(file.mimetype) === -1) {
      req.invalidFileType = true;
    }
    return next(null, true);
  }
}).single('passport-image'));

router.use('/passport-image', require('../../middleware/check-image').router);


router.use('/update-passport-image/', (req, res, next) => {
  templateMixins.extend(res);

  wizard(require('./steps'), fields, {
    controller: BaseController,
    templatePath: path.resolve(__dirname, 'views'),
    translate: i18n.translate.bind(i18n)
  })(req, res, next);
});


module.exports = router;
