'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class CheckPassportImageController extends EvwBaseController {

  locals(req, res) {
    return Object.assign({
      imageUploadFilename: req.sessionModel.get('imageUploadFilename')
    }, super.locals(req, res));
  }

  /*
   * This is a workaround for not being able to use forks that reference a step which is back from the current one.
   * In this case we would like to go back to the /upload-passport-image step if the user selects no for the
   * check-passport-image radio button. Otherwise, continue forwards in the journey.
   */
  successHandler(req, res, callback) {
    if (req.sessionModel.get('check-passport-image') === 'No') {
      return res.redirect('/apply/upload-passport-image');
    }
    return super.successHandler(req, res, callback);
  }

};
