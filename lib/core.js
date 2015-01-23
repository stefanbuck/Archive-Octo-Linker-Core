/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var manifest = require('./manifest');
var reqr = require('./require');
var flash = require('./flash');
var utils = require('./utils');
var updateNotifier = require('./update_notifier');

var version = '3.3.x';
var defaultOptions = {
  showUpdateNotification: false
};

var GitHubLinkerCore = function(global, options) {
  options = options || {};

  this.global = global;
  this.options = _.defaults(options, defaultOptions);

  updateNotifier(this.root, this.options);
};

module.exports = GitHubLinkerCore;

GitHubLinkerCore.prototype.init = function(cb) {
  cb = cb || function() {};

GitHubLinkerCore.prototype.isNewVersion = function() {
  var installedVersion = this.global.localStorage.getItem('github-linker-version');
  if (installedVersion !== version) {
    this.global.localStorage.setItem('github-linker-version', version);
    if (installedVersion) {
      return true;
    }
  }
  return false;
};
