/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var manifest = require('./lib/manifest');
var reqr = require('./lib/require');
var flash = require('./lib/flash');
var utils = require('./lib/utils');

var isNewVersion = function(global) {
  var version = '3.1.x';
  var installedVersion = global.localStorage.getItem('github-linker-version');
  if (installedVersion !== version) {
    global.localStorage.setItem('github-linker-version', version);
    if (installedVersion) {
      return true;
    }
  }
  return false;
};

module.exports = function(global, $, url, cb) {

  if ($('.github-linker').length > 0) {
    return cb(null);
  }

  if (utils.runInBrowser(global)) {
    if (isNewVersion(global)) {
      flash($);
    }
  }

  if (manifest.supported(url)) {
    manifest.init($, url, cb);
  } else if (reqr.supported(url)) {
    reqr.init($, url, cb);
  }
};
