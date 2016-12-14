'use strict';

const _ = require('lodash');

// no-operation const
// const noop = () => {};

// default options
const defaults = {
  from: 'open311'
};

// private implementation of the method. Invoked to
// perform actual transport of the email.
const send = function(message, done) {
  console.log('Sending message %s', message);
  done();
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

  message.from = _.isEmpty(message.from) ? 
	defaults.from : message.from;

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
    send(message, done);
  }
};
