'use strict';

const EvwBaseController = require('../../common/controllers/evw-base');

module.exports = class LinkSentController extends EvwBaseController {

  locals(req, res) {
    return Object.assign({
      emailAddress: req.sessionModel.get('emailAddress')
    }, super.locals.call(this, req, res));
  }
}
