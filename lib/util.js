'use strict';

const _ = require('lodash');

/**
 * Perform the validation of the message instance agains
 * valid email.
 * @param {Message} msg an instance of the Message.
 * @param {Function} onValidation callback to execute when
 *	  validation completes.
 */
exports.validate = function(msg, onValidation) {
  
  // -- make sure receiver's address is set
  if (_.isEmpty(msg.to)) {
    onValidation(new Error('Email is missing receiver address'), null);
    return;
  }
 
  // TODO: Ensure that emails are valid using Regex, Subject exists and body
  // exists.  

  onValidation(null, msg);  

};

exports.isHtml = function(msg) {
  return /<[a-z][\s\S]*>/i.test(msg);
};
