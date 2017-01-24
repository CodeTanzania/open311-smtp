'use strict';

//dependencies
const path = require('path');
// const expect = require('chai').expect;
const mongoose = require('mongoose');
const smtp = require(path.join(__dirname, '..', '..'));
const Message = mongoose.model('Message');

describe('smtp intergration', function () {

  before(function () {
    smtp.start();
  });

  it('should be able to send email', function (done) {
    const details = {
      to: 'lallyelias87@gmail.com',
      subject: 'open311-smtp test',
      body: 'open311-smtp test'
    };
    const message = new Message(details);

    smtp.send(message, function (error, result) {
      done(error, result);
    });

  });

  it.skip('should be able to queue email for later send', function (done) {

    const details = {
      to: 'lallyelias87@gmail.com',
      subject: 'open311-smtp test',
      body: 'open311-smtp test'
    };
    const message = new Message(details);

    smtp._queue.on('message:queue:success', function (message) {
      done(null, message);
    });
    smtp.queue(message);

    done();

  });

  after(function (done) {
    smtp.stop(done);
  });

});
