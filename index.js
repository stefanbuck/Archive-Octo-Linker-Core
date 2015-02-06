'use strict';

var injection = require('github-injection');
var GitHubLinkerCore = require('./lib/core.js');

module.exports  = function(global, options, cb) {
  var instance  = new GitHubLinkerCore(global, options);
  injection(global, function() {
    instance.init(cb);
  });
};
