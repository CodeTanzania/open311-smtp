'use strict';

const path = require('path');

/**
 * @module open311Smtp
 * @version v0.1.0
 * @description The module covers the transport of open311 messages through tranditional email transport mechanisms.
 * @author Moses KABUNGO <kbng.moses@gmail.com>
 * @public
 */
exports = module.exports = function(options) {
  // TODO: inspect and fine tune the options

  const open311Smtp = 
    require(path.join(__dirname, 'lib', 'open311-mail-transport'));
 
  open311Smtp.options = options;

  // return the implementation
  return open311Smtp;
};
