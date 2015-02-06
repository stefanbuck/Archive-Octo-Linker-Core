'use strict';

var async = require('async');
var _ = require('lodash');

module.exports = function(root, options, cb) {

  var InvokeModule = {};
  var modules = {
    require:  require('./require.js'),
    manifest:  require('./manifest.js')
  };

  _.each(modules, function(func, key) {
    InvokeModule[key] = function(cb) {
      func(root, options, cb);
    };
  });

  async.parallel(InvokeModule, function(err, results) {
    if (err) {
      return cb(err);
    }
    cb(null, results);
  });
};
