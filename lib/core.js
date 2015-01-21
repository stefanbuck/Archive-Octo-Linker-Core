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

var version = '3.3.x';
var defaultOptions = {
  showUpdateNotification: false
};

var GitHubLinkerCore = function(global, options) {
  options = options || {};

  this.global = global;
  this.options = _.defaults(options, defaultOptions);

  if (this.showUpdateNotification() && this.isNewVersion()) {
    flash(this.global.$);
  }
};

module.exports = GitHubLinkerCore;

GitHubLinkerCore.prototype.init = function(cb) {
  cb = cb || function() {};
  var url = this.global.document.location.href;
  var $ = this.global.$;

  if (manifest.supported(url)) {
    manifest.init(this.global, url, cb);
  } else {
    reqr.init(this.global, url, cb);
  }
};

GitHubLinkerCore.prototype.showUpdateNotification = function() {
  if (this.options.showUpdateNotification && utils.runInBrowser(this.global)) {
    return true;
  }
  return false;
};

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
