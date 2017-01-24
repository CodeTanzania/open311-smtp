'use strict';

//dependencies
const path = require('path');
const _ = require('lodash');
const expect = require('chai').expect;
const mongoose = require('mongoose');
const faker = require('faker');
const smtp = require(path.join(__dirname, '..', '..'));
const Message = mongoose.model('Message');

describe('smtp', function () {

  it('should be an object', function (done) {
    expect(smtp).to.not.be.null;
    expect(smtp).to.be.an('object');
    done();
  });

  it('should have queue name', function (done) {
    expect(smtp.queueName).to.exist;
    expect(smtp.queueName).to.be.equal('smtp');
    done();
  });

  it('should be able to queue message', function (done) {
    const details = {
      from: faker.internet.email(),
      to: faker.internet.email(),
      body: faker.lorem.sentence()
    };

    //listen to message queue success
    smtp.init();
    smtp._queue.on('message:queue:success', function (message) {

      expect(message).to.exist;
      expect(message._id).to.exist;
      expect(message.queueName).to.be.equal('smtp');
      expect(message.transport).to.be.equal('open311-smtp');
      expect(message.state).to.be.equal(Message.STATE_UNKNOWN);
      expect(message.mode).to.be.equal(Message.SEND_MODE_PUSH);
      expect(message.type).to.be.equal(Message.TYPE_EMAIL);
      expect(message.direction).to.be.equal(Message.DIRECTION_OUTBOUND);
      expect(_.first(message.to)).to.be.equal(details.to);

      done(null, message);
    });


    const message = new Message(details);

    smtp.queue(message);

    expect(message.transport).to.exist;
    expect(message.transport).to.be.equal(smtp.transport);
    expect(message.queueName).to.exist;
    expect(message.queueName).to.be.equal(smtp.queueName);
    expect(message.mode).to.exists;
    expect(message.mode).to.be.equal(Message.SEND_MODE_PUSH);

  });

  it('should be able to simulate message send', function (done) {
    const details = {
      from: faker.internet.email(),
      to: faker.internet.email(),
      body: faker.lorem.sentence(),
      options: {
        fake: true
      }
    };
    const message = new Message(details);

    smtp.send(message, function (error, result) {

      expect(error).to.not.exist;
      expect(result).to.exist;

      expect(result.message).to.exist;
      expect(result.message).to.be.equal('success');

      done();

    });

  });

  afterEach(function (done) {
    smtp.stop(done);
  });

});
