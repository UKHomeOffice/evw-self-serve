'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
const upload = require('../../../lib/upload');
const ErrorClass = require('hof').controllers.error;

module.exports = class UploadPassportImageController extends EvwBaseController {

  validateField(keyToValidate, req) {
    let error;
    if (keyToValidate === 'passport-image' && req.passportImageUploadError) {
      error = new ErrorClass('passport-image', {
        key: 'passport-image',
        type: req.passportImageUploadError,
        redirect: undefined
      });
    }
    return error;
  }

  process(req, res, callback) {
    if (!req.file) {
      req.passportImageUploadError = 'file-required';
    }
    if (req.invalidFileType) {
      req.passportImageUploadError = 'invalid-file-type';
    }
    if (!req.passportImageUploadError) {
      upload.uploadFile(req, (err, uploadResult) => {
        if (err) {
          req.passportImageUploadError = err;
        } else {
          req.session.imageUploadFilename = uploadResult.imageUploadFilename;
          req.session.imageMimetype = uploadResult.imageMimetype;
          req.sessionModel.set('imageUploadFilename', uploadResult.imageUploadFilename);
          req.sessionModel.set('imageUploadObjectId', uploadResult.imageUploadObjectId);
        }
        super.process(req, res, callback);
      });
    } else {
      super.process(req, res, callback);
    }
  }

  locals(req, res) {
    return Object.assign({
      // nationality: req.sessionModel.get('nationality').toLowerCase()
      nationality: 'ARE'
    }, super.locals(req, res));
  }

};
