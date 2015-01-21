/*
* github-linker-core
* https://github.com/stefanbuck/github-linker
*
* Copyright (c) 2014 Stefan Buck
* Licensed under the MIT license.
*/

'use strict';

var request = require('browser-request');
var util = require('util');

function fetchRegistry(name, cb) {

  var url = util.format('https://registry.npmjs.org/%s/latest', name);

  request({
    url: url,
    json: true
  }, function (err, response, body) {
    if (err) {
      return cb(err);
    }

    if (body.homepage) {
      return cb(null, body.homepage);
    }

    cb(new Error('Nothing found'));

  });
}

module.exports = function(name, version, cb) {
  fetchRegistry(name, cb);
}
