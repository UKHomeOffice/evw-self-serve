'use strict';

const conf = require('../config');
const check = require('./virus-check');
const checkAcp = require('./virus-check-acp');
const fs = require('fs');
const mongoConnector = require('./db/connection');
const mongod = require('mongodb');
const Grid = require('gridfs-stream');
const im = require('imagemagick-stream');
const uuid = require('node-uuid');

mongoConnector.setConnectionString(conf.mongo.connectionString);
let gridfs = false;
let dbSingleton = false;

/**
 * Reliably calls the callback function with a connected and 'alive' gridfs connection.
 * NOTE: this method should be called before any interaction with gridfs!
 *
 * @param callback
 */
function createGFSConnection(callback) {
  mongoConnector.getConnection((err, db) => {
    if (!err && (!dbSingleton || dbSingleton !== db)) {
      dbSingleton = db;
      gridfs = new Grid(db, mongod);
    }
    callback(err, gridfs);
  });
}

function save(fileToSave, callback) {
  createGFSConnection((err, gfs) => {
    if (!err) {
      let writestream = gfs.createWriteStream({filename: uuid.v4()});
      fs.createReadStream(fileToSave).pipe(writestream);
      writestream.on('error', callback);
      writestream.on('close', file => {
        callback(err, file);
      });
    } else {
      callback(err);
    }
  });
}

function remove(filename, callback) {
  createGFSConnection((err, gfs) => {
    if (!err) {
      gfs.remove({filename: filename}, removeErr => {
        if (removeErr) {
          return callback(removeErr);
        }
        return callback();
      });
    } else {
      callback(err);
    }
  });
}

function getFileStream(fileID, callback) {
  createGFSConnection((err, gfs) => {
    if (!err) {
      let readstream = gfs.createReadStream({filename: fileID});

      readstream.on('open', readErr => {
        callback(readErr, readstream);
      });

      readstream.on('error', readErr => {
        callback(readErr, undefined);
      });
    } else {
      callback(err);
    }
  });
}

function getPassportImage(image, width, callback) {
  this.getFileStream(image, (err, img) => {
    if (err) {
      return callback(err);
    }
    if (img !== undefined) {
      const height = width;
      img = img.pipe(im().on('error', (imErr) => {
        callback(imErr);
      }).resize(width + 'x' + height));

    }
    callback(err, img);
  });
}

function saveFile(file, callback) {
  if (conf.virusCheckUrl) {
    return checkAcp(conf.virusCheckUrl, file)
      .then(() => {
        this.save(file.path, callback);
      })
      .catch(err => {
        callback(err);
      });
  }
  check(file.path, err => {
    if (!err) {
      this.save(file.path, callback);
    } else {
      callback(err);
    }
  });
}

module.exports = {
  save: save,
  saveFile: saveFile,
  getFileStream: getFileStream,
  getPassportImage: getPassportImage,
  remove: remove
};
