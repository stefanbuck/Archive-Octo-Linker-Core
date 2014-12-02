
var util = require('util');
var fs = require('fs');
var path = require('path');
var env = require('jsdom').env;
var githubLinkerCore = require('../');

module.exports = function(file, done) {
  var $, content, url, filePath;

  url = util.format('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/%s', file);

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
    githubLinkerCore(window, $, url, function(err, result) {
      if (err) {
        throw err;
      }
      done($, result);
    });
  });
};
