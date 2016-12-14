'use strict';

const path     = require('path');
const expect   = require('chai').expect;
const faker    = require('faker');
const mongoose = require('mongoose');

const Message  = mongoose.model('Message');

// the module we're testing
const open311Smtp = require(
  path.join(__dirname, '..', '..', 'lib', 'open311-smtp'));

describe('open311Smtp', function() {

  it ('should be an object', function(done) {
    expect(open311Smtp).to.exist;
    expect(open311Smtp).to.be.an('object');
    done();
  });

  it ('should define the \'queue\' public method', function(done) {
    expect(open311Smtp.queue).to.exist;
    expect(open311Smtp.queue).to.be.a('function');
    done();
  });

  it ('should define the \'send\' public method', function(done) {
    expect(open311Smtp.send).to.exit;
    expect(open311Smtp.send).to.be.a('function');
    done();
  });

  it ('should have a name used by the queue', function(done) {
    expect(open311Smtp.queueName).to.exist;
    expect(open311Smtp.queueName).to.be.equal(open311Smtp.queueName);
    done();
  });

  it ('should be able to queue messages', function(done) {
    
    let message = new Message({
      from: faker.internet.email(),
      to: faker.internet.email(),
      subject: faker.lorem.word(),
      body: faker.lorem.sentence()
    });

    // enqueue message
    open311Smtp.queue(message);

    // post condition
    expect(message.transport).to.exist;
    expect(message.transport).to.be.equal(open311Smtp.transport);
    expect(message.queueName).to.exist;
    expect(message.queueName).to.be.equal(open311Smtp.queueName);

    done();
  });

  it ('should be able to send messages', function(done) {
    
    const details = {
      from: faker.internet.email(),
      to: faker.internet.email(),
      subject: faker.lorem.word(),
      body: faker.lorem.sentence(),
      options: {
	fake: true
      }
    };

    const message = new Message(details);

    open311Smtp.send(message, function(error, response) {
      expect(error).not.to.be.exist;
      expect(response).to.exist;
      expect(response.message).to.exist;
      expect(response.message).to.be.equal('success');

      done();
    });
  });

});
