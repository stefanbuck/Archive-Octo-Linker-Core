'use strict';

var util = require('util');
var cache = require('github-linker-cache');
var glResolve = require('github-linker-resolver');
var builtins = require('builtins');
var validate = require('validate-npm-package-name');

var NODE_API = 'http://iojs.org/api/%s.html';
var NPM_API = 'https://www.npmjs.org/package/';
var BOWER_API = 'http://bower.io/search/?q=';

var RESOLVE_INDICATOR = 'resolve:';

var manifestBuilder = function(type, name, version) {

  // Try to get repo link form the cache module
  var link = cache[type][name];

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

var validatePackageName = function (name) {
  var result = validate(name);
  return result.validForNewPackages || result.validForOldPackages;
};

var requireBuilder = function(url, requireValue) {
  var link = '';

  if (builtins.indexOf(requireValue) !== -1) {
    // Redirect to http://iojs.org/api/{module}.html
    link = util.format(NODE_API, requireValue);
  } else if (cache.npm[requireValue]) {
    // Get repo link from cache list
    link = cache.npm[requireValue];
  } else {
    if (validatePackageName(requireValue)) {
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
