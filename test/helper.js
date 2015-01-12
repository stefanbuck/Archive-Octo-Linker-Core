
var util = require('util');
var fs = require('fs');
var path = require('path');
var env = require('jsdom').env;
var GitHubLinkerCore = require('..');

module.exports = function(file, url, done) {
  var $, content, baseUrl, filePath;
  baseUrl = 'https://github.com/github-linker/core/';

  if (typeof url === 'function') {
    done = url;
    url = 'blob/master/test/fixtures/' + file;
  }

  url = baseUrl + url;

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

    var options = {
      showUpdateNotification: false
    };

    new GitHubLinkerCore(window, url,  options, function(err, result) {
      if (err) {
        throw err;
      }
      done($, result);
    });
  });
};
