'use strict';

var util = require('util');
var fs = require('fs');
var path = require('path');
var env = require('jsdom').env;
var core = require('..');

module.exports = function(file, url, done) {
  var $, content, baseUrl, filePath;
  baseUrl = 'https://github.com/github-linker/core/';

  if (typeof url === 'function') {
    done = url;
    url = baseUrl + 'blob/master/test/fixtures/' + file;
  }

  if (process.env.TEST_ENV === 'remote') {
    content = url;
    console.log('    remote tests');
  } else {
    console.log('    local tests');
    filePath = util.format('./fixtures/%s.html', file);
    filePath = path.resolve(__dirname, filePath);
    content = fs.readFileSync(filePath, 'utf-8');
  }

  env(content, function(err, window) {
    if (err) {
      return done(err);
    }
    $ = require('jquery')(window);

    if (process.env.TEST_ENV !== 'remote') {
      window.document.location.href = url;
    }

    if (process.env.TEST_ENV !== 'remote') {
      window.document.location.href = url;
    }

    var options = {
      showUpdateNotification: false,
      changelog: 'https://github.com/github-linker/chrome-extension/releases',
      version: '4.0.0'
    };

    core(window, options, function(err, result) {
      if (err) {
        throw err;
      }
      done($, result);
    });
  });
};
