'use strict';

var _ = require('lodash');
var updateNotifier = require('./update_notifier');
var modules = require('./modules');

var defaultOptions = {
  showUpdateNotification: true,
  changelog: undefined,
  version: undefined
};

var GitHubLinkerCore = function(root, options) {
  options = options || {};

  if (!options.version) {
    throw new Error('Missing option version');
  }
  if (!options.changelog) {
    throw new Error('Missing option changelog');
  }

  this.root = root;
  this.options = _.defaults(options, defaultOptions);

  updateNotifier(this.root, this.options);
};

module.exports = GitHubLinkerCore;

GitHubLinkerCore.prototype.init = function(cb) {
  cb = cb || function() {};

  modules(this.root, this.options, cb);
};
