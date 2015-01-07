/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var cache = require('github-linker-cache');
var glResolve = require('github-linker-resolve');

// List of nodejs core modules (v0.11.13)
// see: https://github.com/joyent/node/blob/master/lib/repl.js#L72
var NODE_CORE_MODULES = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib', 'smalloc', 'tracing'];

var NODE_API = 'http://nodejs.org/api/%s.html';
var NPM_API = 'https://www.npmjs.org/package/';
var BOWER_API = 'http://bower.io/search/?q=';

var GITHUBCOM = 'https://github.com';
var RESOLVE_INDICATOR = 'resolve:';

var manifestBuilder = function(type, name, version) {

  // Try to get repo link form the cache module
  var link = cache[type][name];

  if (version.split('/').length === 2) {
    link = GITHUBCOM + '/' + version.replace('#', '/tree/');
  }

  if (!link) {
    // Is it maybe just a git url?
    link = glResolve(version);
  }

  if (!link) {
    // Nothing was found. Maybe the cache module is outdated.
    // Therefore send the user to the registry.
    if (type === 'npm') {
      link = NPM_API + name;
    } else if (type === 'bower') {
      link = BOWER_API + name;
    }
  }

  return link || '';
};

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

var requireBuilder = function(url, requireValue) {
  var link = '';

  if (NODE_CORE_MODULES.indexOf(requireValue) !== -1) {
    // Redirect to http://nodejs.org/api/{module}.html
    link = util.format(NODE_API, requireValue);
  } else if (cache.npm[requireValue]) {
    // Get repo link from cache list
    link = cache.npm[requireValue];
  } else {
    if (validPackageName(requireValue)) {
      // Try to resolve link via https://www.npmjs.org/package/{name}
      link = RESOLVE_INDICATOR + NPM_API + requireValue;
    } else {
      // Resolve paths, duojs and github shorthand
      link = glResolve(requireValue, url);
      if (link) {
        link = RESOLVE_INDICATOR + link;
      }
    }
  }
  return link;
};

module.exports = {
  require: requireBuilder,
  manifest: manifestBuilder
};
