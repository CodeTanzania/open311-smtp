'use strict';

const path     = require('path');
const faker    = require('faker');
const mongoose = require('mongoose');
const expect   = require('chai').expect;

const open311Smtp = require(
  path.join(__dirname, '..', '..', 'lib', 'open311-smtp'));

describe('open311Smtp integration', function() {
  it ('should be able to send plain emails', function(done) {
    const details = {
	to:   '"Moses Kabungo" <kbng.moses@gmail.com>',
	subject: faker.lorem.word(),
	body: faker.lorem.sentence()
    };

    const message = new (mongoose.model('Message'))(details);

    open311Smtp.send(message, function(err, response) {
      expect(err).not.to.exit;
      expect(response).to.exist;
      done();
    });
  });

});
