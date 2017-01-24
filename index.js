'use strict';


/**
 * @module open311-smtp
 * @version 0.1.0
 * @description smtp transport for open311-messages
 * @see {@link https://github.com/CodeTanzania/open311-messages}
 * @see {@link https://github.com/nodemailer/nodemailer}
 * @author lally elias <lallyelias87@gmail.com>
 * @public
 */


//dependencies
const _ = require('lodash');
const async = require('async');
const kue = require('kue');
const messages = require('open311-messages');
const nodemailer = require('nodemailer');
const noop = function () {};


/**
 * @name defaults
 * @description default configuration options
 * @type {Object}
 * @since 0.1.0
 * @private
 */
exports.defaults = {

  //default queue time to wait to shutdown
  timeout: 5000,

  //default number of worker to spawn on processing mails
  concurrency: 10,

  //default mail sender if non provided during send
  from: 'open311<ope311@gmail.com>',

  //default smtp port to connect
  port: 465,

  //default smtp server hostname or IP address to connect
  host: 'smtp.gmail.com',

  //defines if the connection should use SSL
  secure: true,

  // default authentication data
  auth: {
    user: 'open311@gmail.com', //username
    pas: 'open311@qwerty' //password for the user
  }

};


/**
 * @name queueName
 * @description name of the queue that will be used by smtp transport
 *              to enqueue message for sending
 * @type {String}
 * @since 0.1.0
 * @public
 */
exports.queueName = 'smtp';


/**
 * @name transport
 * @description name of the transport provided by smtp.
 * 
 *              This must be name of node module or file path pointing to
 *              a node module implement `send()`.
 *              
 * @type {String}
 * @since 0.1.0
 * @public
 */
exports.transport = 'open311-smtp';


/**
 * transport message send mode
 */
// exports.mode;


/**
 * transport message type i.e email, sms, push etc
 */
// exports.type;


/**
 * @name init
 * @description initialize smtp internals
 * @since 0.1.0
 * @private
 * @see {@link exports.defaults}
 * @example
 *
 * const smtp = require('open311-smtp');
 * smtp.options = {
 *  port: <your_smtp_server_port>,
 *  host: <your_smtp_host>,
 *  auth:{
 *    user:<your_smtp_account_username>,
 *    password:<your_smtp_account_password>
 *  }
 * };
 * smtp.init();
 * 
 */
exports.init = function () {

  //merge options
  exports.options = _.merge({}, exports.defaults, exports.options);

  //initialize open311-messages
  if (!exports.Message) {
    //instantiate open311-messages
    exports.Message = messages(exports.options);

    //sent send mode
    exports.mode = exports.Message.SEND_MODE_PUSH;

    //set message type
    exports.type = exports.Message.TYPE_EMAIL;
  }

  //initialize worker processing queue
  //for internal usage
  if (!exports._queue) {
    exports._queue = kue.createQueue(exports.options);
  }

  //initiate nodemailer smtp transport
  //@see {@link https://nodemailer.com/smtp/}
  if (!exports.smtp) {
    exports.smtp = nodemailer.createTransport(exports.options);
  }

};


/**
 * @name queue
 * @description queue message instance for sending
 * @param  {Message} message valid instance of open311-message
 * @since 0.1.0
 * @public
 * @example
 *
 * const Message = require('open311-messages')(<your_options>);
 * const smtp = require('open311-smtp');
 * const message = new Message(<details>);
 * smtp.queue(message);
 * 
 */
exports.queue = function (message) {

  //ensure is already initialized
  exports.init();

  //update message with transport details
  message.transport = exports.transport;
  message.queueName = exports.queueName;
  message.mode = exports.mode;
  message.type = exports.type;

  //ensure from is set-ed
  if (!message.from) {
    message.from = exports.options.from;
  }

  message.queue();

};


/**
 * @name _send
 * @description send email message
 * @param  {Message}   message valid open311-message instance
 * @param  {Function} done    a callback to invoke on success or failure
 * @type {Function}
 * @since 0.1.0
 * @private
 */
exports._send = function (message, done) {

  async
  .waterfall([

    function verifyTransport(next) {
      exports.smtp.verify(next);
    },

    function sendEmail(transportReady, next) {
      // TODO convert to valid nodemailer smtp payload
      // TODO validate emails
      // TODO compile email template
      // TODO include text message
      exports.smtp.sendMail(message, next);
    }

  ], done);

};


/**
 * @name send
 * @description implementation of open311 message send to allow send message
 *              as an email using nodemailer smtp transport 
 * @param  {Message}   message valid open311 message instance
 * @param  {Function} done    a callback to invoke on success or failure
 * @return {Object|Error}     result or error during sending email message
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const Message = require('open311-messages')(<your_options>);
 * const smtp = require('open311-smtp');
 * const message = new Message(<details>);
 * smtp.send(message, function(error, response){
 *  ...
 * });
 */
exports.send = function (message, done) {
  //ensure already initialized
  exports.init();

  //obtain message additional send options
  const options = message.options;

  //simulate send
  if (options && options.fake) {
    done(null, {
      message: 'success'
    });
  }

  //send actual email
  else {
    exports._send(message, done);
  }

};


/**
 * @name stop
 * @description gracefull shutdown kue
 * @see {@link https://github.com/Automattic/kue#graceful-shutdown}
 * @param {Function} [done] a callback to invoke on succes or failure
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const smtp = require('open311-smtp');
 * smtp.stop();
 *  
 */
exports.stop = function stop(done) {

  //ensure callback
  if (!done && !_.isFunction(done)) {
    done = noop;
  }

  //ensure queue safe shutdown
  if (exports._queue) {
    if (exports._queue.shuttingDown) {
      done();
    } else {
      const { timeout } = exports.options;
      exports._queue.shutdown(timeout, done);
    }
  } else {
    done();
  }

};


/**
 * @name start
 * @description setup smtp message(s) worker and start to process 
 *              `smtp` jobs
 * @type {Function}
 * @since 0.1.0
 * @public
 * @example
 *
 * const smtp = require('open311-smtp');
 * smtp.start();
 * 
 */
exports.start = function () {

  //ensure already initialized
  exports.init();

  //reference open311-message model
  const Message = exports.Message;

  //register worker for processing message 
  //and send it as email notification
  const { concurrency } = exports.options;
  exports._queue.process(exports.queueName, concurrency, Message.process);

  //listen for process termination
  //and gracefull shutdown email worker queue
  process.once('SIGTERM', function ( /*signal*/ ) {
    exports._queue.shutdown(function ( /*error*/ ) {
      process.exit(0);
    });
  });

};
