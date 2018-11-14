'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');
module.exports = class DeclarationController extends EvwBaseController {
  locals(req, res) {
    return Object.assign({
      updateToUK: req.sessionModel.get('update-to-uk')
    }, super.locals.call(this, req, res));
  }
}
