/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var _ = require('lodash');
var manifest = require('./lib/manifest');
var reqr = require('./lib/require');
var flash = require('./lib/flash');
var utils = require('./lib/utils');

var version = '3.2.x';
var defaultOptions = {
  showUpdateNotification: false
};

var GitHubLinkerCore = function(global, url, options, cb) {
  options = options || {};
  cb = cb || function() {};

  this.global = global;
  var $ = this.global.$;

  if ($('.github-linker').length > 0) {
    return cb(null);
  }

  this.options = _.defaults(options, defaultOptions);

  if (this.showUpdateNotification() && this.isNewVersion()) {
    flash($);
  }

  if (manifest.supported(url)) {
    manifest.init($, url, cb);
  } else {
    reqr.init($, url, cb);
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

module.exports  = function(global, url, options, cb) {
  new GitHubLinkerCore(global, url, options, cb);
};
