'use strict';

//dependencies
const path = require('path');
const expect = require('chai').expect;
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
      body: '<h1>open311-smtp test</h1>',
      mime: Message.MIME_HTML
    };
    const message = new Message(details);

    smtp.send(message, function (error, result) {
      done(error, result);
    });

  });

  it('should be able to queue email for later send', function (done) {

    const details = {
      to: 'lallyelias87@gmail.com',
      subject: 'open311-smtp test',
      body: '<h1>open311-smtp test</h1>'
    };
    const message = new Message(details);

    smtp._queue.on('errror', function (error) {
      done(error);
    });

    smtp._queue.on('message:sent:error', function (error) {
      done(error);
    });

    smtp._queue.on('message:sent:success', function (message) {
      expect(message).to.exist;
      expect(message.result).to.exist;
      expect(message.state).to.be.equal(Message.STATE_DELIVERED);
      done(null, message);
    });

    smtp._queue.on('message:queue:error', function (error) {
      done(error);
    });

    smtp._queue.on('message:queue:success', function (message) {
      expect(message).to.exist;
      expect(message.mime).to.be.equal(Message.MIME_HTML);
    });
    smtp.queue(message);

  });

  after(function (done) {
    smtp.stop(done);
  });

});
