open311-smtp module
===================

[![Build Status](https://travis-ci.org/CodeTanzania/module-starter.svg?branch=master)](https://travis-ci.org/CodeTanzania/module-starter)
[![Dependencies Status](https://david-dm.org/CodeTanzania/module-starter/status.svg?style=flat-square)](https://david-dm.org/CodeTanzania/module-starter)

open311 module starter

## Dependencies
### Development 
- [NodeJS v6.9.2+](https://nodejs.org)
- [chai](http://chaijs.com)
- [faker](http://marak.github.io/faker.js/)
- [grunt](http://gruntjs.com/)
- [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)
- [grunt-contrib-watch](https://github.com/gruntjs/grunt-contrib-watch)
- [grunt-mocha-test](https://github.com/gruntjs/grunt-mocha-test)
- [jshint-stylish](https://www.npmjs.com/package/jshint-stylish)
- [mocha](https://mochajs.org/)

### All
- [async](https://caolan.github.io/async/)
- [kue](https://github.com/Automattic/kue)
- [lodash](https://lodash.com)
- [nodemailer](https://github.com/nodemailer/nodemailer)
- [open311-messages](https://github.com/CodeTanzania/open311-messages)

## Usage
- Clone
```sh
$ git clone https://github.com/CodeTanzania/open311-smtp.git <your_module_name>
``` 

- Install dependencies
```sh
$ cd <your_module_name>
$ npm install
```

- Open `.git/config` and update repository url
```ruby
[remote "origin"]
    url = https://github.com/<your_repo_url>.git
```

## Testing
* Clone this repository

* Install all development dependencies
```sh
$ npm install
```

* Then run test
```sh
$ npm test
```

## Contribute
It will be nice, if you open an issue first so that we can know what is going on, then, fork this repo and push in your ideas. Do not forget to add a bit of test(s) of what value you adding.

## Licence
The MIT License (MIT)

Copyright (c) 2016 CodeTanzania & Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. 
