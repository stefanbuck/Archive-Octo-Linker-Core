/*
* github-linker-core
* https://github.com/stefanbuck/github-linker
*
* Copyright (c) 2014 Stefan Buck
* Licensed under the MIT license.
*/

'use strict';

var npmResolver = require('./npm');
var filesystemResolver = require('./filesystem');
var global;

function resolver(type, value, cb) {
  if (type === 'npm') {
    var name = value.split(';')[0];
    var version = value.split(';')[1];
    return npmResolver(name, version, function(err, link) {
      if (err) {
        return cb(new Error('No match'))
      }

      cb(null, link);
    });
  } else if (type === 'filesystem') {
    return filesystemResolver(value, function(err, link) {
      if (err) {
        return cb(new Error('No match'))
      }

      cb(null, link);
    });
  }

  cb(new Error('No resolver found'));
}

function clickHandler(e) {
  e.stopPropagation();

  var $el = $(this);
  var type = $el.data('type');
  var value = $el.data('value');

  $el.addClass('tooltipped tooltipped-e').attr('aria-label', 'Loading...');

  resolver(type, value, function(err, url) {
    if (err || !url) {
      return $el.addClass('tooltipped tooltipped-e').attr('aria-label', err.message);
    }

    global.location.href = url;
  });
}

module.exports = function(window) {
  global = window;
  $(global.document.body).undelegate('.github-linker-live-resolver', 'click', clickHandler);
  $(global.document.body).delegate('.github-linker-live-resolver', 'click', clickHandler);
}
