'use strict';

const _          = require('lodash');
const path       = require('path');
const nodemailer = require('nodemailer');
// const fs         = require('fs');

// we need this to perform trivial operations on email messages
// such as validations
const emailUtils = require(path.join(__dirname, 'util'));

// config's file size is real small. Sync read could do it.
// const smtpConfig = () => { return JSON.parse(fs.readFileSync(
//	path.join(__dirname, '..', 'config.nodemailer.json'))); };

// no-operation const
// const noop = () => {};

// SMTP transport implementatation. The confiration is done in
// the _init_ function
let transporter;

// default options
const defaults = {
  from: 'open311'
};

// -- bootstrap the module before serving the client code
const _init_ = function() {

  // let configs = smtpConfig(); 

  // console.log('Object %s', JSON.stringify(configs));

  // -- make sure the configurations does indeed exist
  // if (_.isNull(configs) || _.isUndefined(configs) || !_.isObject(configs)) {
    
    // --- notify the client of the service that we need em.
    // throw new Error('Cannot load transport configurations from the file!');
  // }

  // -- else
  const transport = {
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: {
      user: 'kbng.moses@gmail.com',
      pass: '!#qBVC)%1'
    }/*,
    debug: true,
    send: function(mail, callback) {
      const input = mail.message.createReadStream();
      input.pipe(process.stdout);
      input.on('end', function() {
	callback(null, true);
      });
    }*/
  };

  const options = {
    from: 'Moses Kabungo <kbng.moses@gmail.com>'
  };

  // -- configure the nodemailer#transport
  transporter = nodemailer
    .createTransport(transport, options);
};

// private implementation of the method. Invoked to
// perform actual transport of the email.
const _send_ = function(message, done) {
  // console.log('Sending message %s', message);
  // we do not worry about re-initializing the smtp connection each time
  // send method is invoked because nodemailer already got this handled
  _init_();

  // validate the message instance against valid email
  emailUtils.validate(message, function(err, msg) {
    if (err) {
      done(err, null);
    } else {
      
      // compose the email
      let email = _.merge({
         to: '"Moses Kabungo" <kbng.moses@gmail.com>',
         subject: msg.subject
      }, emailUtils.isHtml(msg.body) ? {
	 html: msg.body
      }: {
	 text: msg.body
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
    _send_(message, done);
  }
};
