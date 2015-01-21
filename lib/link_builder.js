/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var glResolve = require('github-linker-resolver');

// List of nodejs core modules (v0.11.13)
// see: https://github.com/joyent/node/blob/master/lib/repl.js#L72
var NODE_CORE_MODULES = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib', 'smalloc', 'tracing'];

var NODE_API = 'http://nodejs.org/api/%s.html';

// Method taken from https://github.com/npm/npm-package-arg/blob/97487d38bcf1879d7c32dd577b181abb65af4e02/npa.js
var validPackageName = function (name) {
  if (!name) {
    return false;
  }
  var n = name.trim();
  if (!n || n.charAt(0) === '.' || !n.match(/^[a-zA-Z0-9]/) || n.match(/[\/\(\)&\?#\|<>@:%\s\\\*'"!~`]/) || n.toLowerCase() === 'node_modules' || n !== encodeURIComponent(n) || n.toLowerCase() === 'favicon.ico') {
    return false;
  }
  return n;
};

module.exports = function(type, meta) {
  if (type === 'npm' || type === 'bower') {
    return glResolve(meta.version) || '';

  } else if (type === 'require') {
    if (NODE_CORE_MODULES.indexOf(meta.name) !== -1) {
      return util.format(NODE_API, meta.name);
    } else if(!validPackageName(meta.name)) {
      return glResolve(meta.name, meta.url) || '';
    }
  }
}
