'use strict';

exports.transport = {

  // Name of the service. NOTE that, Gmail requires email owner to turn on
  // "accept connection from less secure app".
  service: 'Gmail',

  // Write your own MX
  host: 'smtp.gmail.com',

  // You might also need to define port
  port: 465,

  // Almost all MX Server require ssl sessions
  secure: true,

  // Authorization settings.
  // user is the email address and pass is the password required.
  auth: {
    user: '', // username e.g. alice.bob@academia.edu
    pass: '', // password e.g. AliceB123
  } //,

  // pool: true, // enable to send multiple emails in a single connection
 
  // Uncomment the following line to configure the proxy.
  // NOTE: use sock5:// protocol for a SOCK5 http/s proxy config
  // OR use sock4a:// or sock4 protocol for a SOCK4 http/s proxy config
  // proxy: 'sock://hostname:port'
};

exports.options = {
  // The email address can appear plain as in `alice.bob@academia.edu` or
  // properly formatted as in `"Alice Bob" <alice.bob@academia.edu>`
  from: '"First-name, Last-name" <email>'
};
