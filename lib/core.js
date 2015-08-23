'use strict';

var _ = require('lodash');
var updateNotifier = require('./update_notifier');
var modules = require('./modules');
var liveResolver = require('./live-resolver');

var defaultOptions = {
  showUpdateNotification: false,
  changelog: undefined
};

var GitHubLinkerCore = function(root, options) {
  options = options || {};

  if (!root) {
    throw new Error('Missing argument window');
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

  liveResolver();

  modules(this.root, this.options, cb);
};
