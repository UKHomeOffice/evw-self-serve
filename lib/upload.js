'use strict';

const fs = require('fs');
const imageFunctions = require('./image-functions');
const deferred = require('deferred');
const config = require('../config');

function saveToGridFs(req, def) {
  imageFunctions.saveFile(req.file, (err, file) => {
    if (err) {
      def.reject('Problem saving file to database', err);
    } else {
      def.resolve(file);
    }
  });
  return def.promise;
}

function deleteFile(file) {
  if (file) {
    try {
      fs.unlinkSync(file.path);
    } catch (e) {
      return;
    }
  }
}

function saveFile(req, onSuccess, onError) {
  let result = saveToGridFs(req, deferred());
  result.done(file => {
    deleteFile(file);
    onSuccess(null, {
      /* eslint-disable no-underscore-dangle*/
      imageUploadObjectId: file._id,
      /* eslint-enable no-underscore-dangle*/
      imageUploadFilename: file.filename,
      imageMimetype: req.file.mimetype
    });
  }, err => {
    deleteFile(req.file);
    onError(err);
  });
}

function handleUpload(req, callback) {
  if (req.file.size > config.maxUploadSize) {
    deleteFile(req.file);
    return callback('file-too-large');
  }
  // Two attempts to save the file before displaying an error message
  this.saveFile(req, callback, () => {
    this.saveFile(req, callback, () => {
      return callback('error-saving-file');
    });
  });
}

module.exports = {
  uploadFile: handleUpload,
  saveFile: saveFile,
  deleteFile: deleteFile,
  saveToGridFs: saveToGridFs
};
