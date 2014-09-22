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
var cache = require('github-linker-cache');

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

  var link = cache[type][name];

  if (version.split('/').length === 2) {
    link = GITHUBCOM + '/' + version.replace('#', '/tree/');

  } else if (!link) {

    if (type === 'npm') {
      link = NPM_API + name;
    } else if (type === 'bower') {
      link = BOWER_API + name;
    }
  }

  return link || '';
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

// Method taken from https://github.com/npm/npm-package-arg/blob/97487d38bcf1879d7c32dd577b181abb65af4e02/npa.js
function maybeGitHubShorthand (arg) {
  return /^[^@%\/\s\.-][^@%\/\s]*\/[^@\s\/%]+(?:#.*)?$/.test(arg);
}

function duoBranchShorthand (arg) {
  return /^[^@%\/\s\.-][^@%\/\s]*\/[^@\s\/%]+(?:#.*)?@(\w*)$/.test(arg);
}

function duoPathShorthandFile(arg) {
  var res = arg.match(/^([^@%\/\s\.-][^@%\/\s]*\/[^@\s\/%]+(?:#.*)?)@([^:]*):(.*)$/);
  if (res) {
    return {
      repo: res[1],
      tag: res[2],
      file: res[3]
    };
  }
  return null;
}

var requireBuilder = function(url, requireValue) {

  var link = '';

  if (INVALID_REQUIRE_VALUES.indexOf(requireValue) !== -1) {
    return link;
  }

  if (NODE_CORE_MODULES.indexOf(requireValue) !== -1) {

    link = util.format(NODE_API, requireValue);

  } else if (cache.npm[requireValue]) {

    link = cache.npm[requireValue];

  } else {
    if (isLocalPath(requireValue)) {
      var basePath = url.replace(GITHUBCOM, '');
      link = path.resolve(path.dirname(basePath), requireValue);
      if (link.charAt(link.length - 1) === '/') {
        link = link.slice(0, -1);
      }
      link = RESOLVE_INDICATOR + GITHUBCOM + link;
    } else if (validPackageName(requireValue)) {
      link = RESOLVE_INDICATOR + NPM_API + requireValue;
    } else if (maybeGitHubShorthand(requireValue)) {
      link = RESOLVE_INDICATOR + GITHUBCOM + '/' + requireValue;
    } else if (duoBranchShorthand(requireValue)) {
      link = RESOLVE_INDICATOR + GITHUBCOM + '/' + requireValue.replace('@', '/tree/');
    }  else if (duoPathShorthandFile(requireValue)) {
      var duoValues = duoPathShorthandFile(requireValue);
      link = RESOLVE_INDICATOR + GITHUBCOM + '/' + path.join(duoValues.repo, 'tree', duoValues.tag, duoValues.file);
    }
  }
  return link;
};

module.exports = {
  require: requireBuilder,
  manifest: manifestBuilder
};
