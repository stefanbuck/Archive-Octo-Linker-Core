/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');
var path = require('path');
var registries = require('github-linker-registries');

// List of nodejs core modules (v0.11.13)
// see: https://github.com/joyent/node/blob/master/lib/repl.js#L72
var NODE_CORE_MODULES = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib', 'smalloc', 'tracing'];

var NODE_API = 'http://nodejs.org/api/%s.html';
var NPM_API = 'https://www.npmjs.org/package/';
var BOWER_API = 'http://bower.io/search/?q=';

var GITHUBCOM = 'https://github.com';
var RESOLVE_INDICATOR = 'resolve:';
var INVALID_REQUIRE_VALUES = ['.', '...', '/'];

var manifestBuilder = function(type, name, version) {

  var link = registries[type][name];

  if (version.split('/').length === 2) {
    link = GITHUBCOM + '/' + version.replace('#', '/tree/');

  } else if (!link) {

    if (type === 'npm') {
      link = NPM_API + name;
    } else if (type === 'bower') {
      link = BOWER_API + name;
    }
  }

  return link;
};

var isLocalPath = function(val) {
  if (val === '..') {
    return true;
  }
  var result = val.match(/^(\.\/|\.\.\/)/gm);
  if (result && result.length > 0) {
    return true;
  }
  return false;
};

var requireBuilder = function(url, requireValue) {

  var link = null;

  if (INVALID_REQUIRE_VALUES.indexOf(requireValue) !== -1) {
    return link;
  }

  if (NODE_CORE_MODULES.indexOf(requireValue) !== -1) {

    link = util.format(NODE_API, requireValue);

  } else if (registries.npm[requireValue]) {

    link = registries.npm[requireValue];

  } else {
    if (isLocalPath(requireValue)) {
      var basePath = url.replace(GITHUBCOM, '');
      link = path.resolve(path.dirname(basePath), requireValue);
      if (link.charAt(link.length - 1) === '/') {
        link = link.slice(0, -1);
      }
      link = RESOLVE_INDICATOR + GITHUBCOM + link;
    } else {
      link = RESOLVE_INDICATOR + NPM_API + requireValue;
    }
  }

  return link;
};

module.exports = {
  require: requireBuilder,
  manifest: manifestBuilder
};
