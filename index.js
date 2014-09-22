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

module.exports = function($, url, cb) {

  if ($('.github-linker').length > 0) {
    return cb(null);
  }

  if (manifest.supported(url)) {
    manifest.init($, url, cb);
  } else if (reqr.supported(url)) {
    reqr.init($, url, cb);
  }
};
