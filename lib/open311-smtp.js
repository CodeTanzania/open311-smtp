'use strict';

const _          = require('lodash');
const path       = require('path');
const nodemailer = require('nodemailer');


// we need this to perform trivial operations on email messages
// such as validations
const emailUtils = require(path.join(__dirname, 'util'));

// transport configurations
const smtpConfigs  = require(path.join(__dirname, 'transport-config'));

// SMTP transport implementatation. The confiration is done in
// the _init_ function
let transporter;

// -- bootstrap the module before serving the client code
const _init_ = function() {

  // -- configure the nodemailer#transport
  transporter = nodemailer
    .createTransport(smtpConfigs.transport, smtpConfigs.options);
};

// private implementation of the method. Invoked to
// perform actual transport of the email.
const _send_ = function(message, done) {
 
  // is transporter initialized?
  if (_.isUndefined(transporter) || _.isNull(transporter)) {
    // call init to initialize it
    _init_();
  }

  // validate the message instance against valid email
  emailUtils.validate(message, function(err, msg) {
    if (err) {
      done(err, null);
    } else {
      
      // compose the email
      let email = _.merge({
         to: message.to,
         subject: msg.subject 
      }, 
         emailUtils.isHtml(msg.body) ? {
	 html: msg.body }: { text: msg.body 
      });

      // let nodemailer#transport do the heavy lifting
      transporter.sendMail(email, done);
    }
  });
};

/**
 * @name open311Smtp#queueName
 * @description unique identifier used by the queue to id the type of message
 * @type {string}
 * @since v0.1.0
 */
exports.queueName = 'smtp';

/**
 * @name open311Smtp#transport
 * @description unique identifier used by the queue to id the type of transport
 *		required to process the message
 * @see open311Smtp#queueName
 * @type {string}
 * @since v0.1.0
 */
exports.transport = 'open311-smtp';

/**
 * Enqueues message for later transport schedualing.
 * @param {Message} message. An instance of open311 email message to enqueue
 * @since v0.1.0
 */
exports.queue = function(message) {
  // logic to enqueue the message
  message.transport = exports.transport;
  message.queueName = exports.queueName;

  // instruct the message to queue itself
  message.queue();
};


/**
 * Sends email message.
 * @param {Message} message. An instance of open311 message to send.
 * @param {Function} done. Callback method invoked when sending message
 *	  is done.
 * @since v0.1.0
 */
exports.send = function(message, done) {
  // logic to send the message
  // check if we're in testing mode
  if (message.options && message.options.fake) {
    done(null, { message: 'success' });
  } else {
    _send_(message, done);
  }
};
