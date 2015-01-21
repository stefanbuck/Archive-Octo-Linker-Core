/*
* github-linker-core
* https://github.com/stefanbuck/github-linker
*
* Copyright (c) 2014 Stefan Buck
* Licensed under the MIT license.
*/

'use strict';

var util = require('util');
var path = require('path');
var request = require('browser-request');

function tryLoading(urls, cb) {
  var url = urls.shift();

  request({
    url: url,
    method: 'head',
  }, function (err, response, body) {
    if (err || response.statusCode >= 300) {
      if (urls.length > 0) {
        return tryLoading(urls, cb);
      }

      return cb(err);
    }

    cb(null, url);
  });
}

module.exports = function(link, cb) {

  // TODO implement dynamic file extension for eg. coffee
  var fileExtension = '.js';

  var urls = [];
  if (link.indexOf('https://github.com') === 0) {
    if (path.extname(link)) {
      urls.push(link);
    } else {
      urls.push(link + fileExtension);
    }
    urls = urls.concat([
      link + '/index' + fileExtension,
      link.replace('blob', 'tree')
      ]);
    } else {
      urls = link.split(',');
    }

    tryLoading(urls, cb);
}


var attemptToLoadURL = function($, urls, cb) {
  var url = urls.shift();
  $.ajax({
    url: url,
    type: 'HEAD',
    timeout: 3000
  }).then(function() {
    cb(url);
  }).fail(function() {
    if (urls.length > 0) {
      attemptToLoadURL($, urls, cb);
    } else {
      cb(null);
    }
  });
};
