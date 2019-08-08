'use strict';

const fs = require('fs');
const rp = require('request-promise');

module.exports = function scan(url, file) {
  return rp.post({
    uri: url,
    rejectUnauthorized: false,
    resolveWithFullResponse: true,
    formData: {
      name: 'file',
      file: {
        value: fs.createReadStream(file.path),
        options: {
          filename: file.originalname,
          contentType: file.mimetype
        }
      }
    }
  }).then(response => {
    if (response.statusCode === 200) {
      return Promise.resolve();
    }
    return Promise.reject(response);
  }).catch(err => {
    return Promise.reject(err);
  });
};
