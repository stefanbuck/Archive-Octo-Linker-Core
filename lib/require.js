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
var registries = require('github-linker-registries').npm;
var utils = require('./utils');

// List of nodejs core modules (v0.11.13)
// see: https://github.com/joyent/node/blob/master/lib/repl.js#L72
var coreModules = ['assert', 'buffer', 'child_process', 'cluster', 'crypto', 'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https', 'net', 'os', 'path', 'punycode', 'querystring', 'readline', 'stream', 'string_decoder', 'tls', 'tty', 'url', 'util', 'vm', 'zlib', 'smalloc', 'tracing'];
var GITHUBCOM = 'https://github.com';
var NODEAPICOM = 'http://nodejs.org/api/%s.html';
var NPMAPICOM = 'https://www.npmjs.org/package/';
var SORRY = 'Can\'t resolve this require for you, sorry.';
var RESOLVE_INDICATOR = 'resolve:';

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

var getRequireLink = function(url, requireValue) {

  var link = '';

  if (coreModules.indexOf(requireValue) !== -1 ) {

    link = util.format(NODEAPICOM, requireValue);

  } else if (registries[requireValue]) {

    link = registries[requireValue];

  } else {
    if (isLocalPath(requireValue)) {
      var basePath = url.replace(GITHUBCOM, '');
      link = path.resolve(path.dirname(basePath), requireValue);
      if (link.charAt(link.length - 1) === '/') {
        link = link.slice(0, -1);
      }
      link = RESOLVE_INDICATOR + GITHUBCOM + link;
    } else {
      link = RESOLVE_INDICATOR + NPMAPICOM + requireValue;
    }
  }

  return link;
};

var attemptToLoadURL = function($, urls, cb) {
  var url = urls.shift();
  $.ajax({
    url: url,
    type: 'HEAD',
    timeout: 3000
  }).then(function() {
    cb(url);
  }).fail(function() {
    if (urls.length > 0) {
      attemptToLoadURL($, urls, cb);
    } else {
      cb(null);
    }
  });
};

var registerClickListener = function($, fileExtension) {
  fileExtension = '.' + fileExtension;

  $('body').on('click', 'a.github-linker', function(e) {
    utils.showLoader($);
    var $el = $(this);
    var link = $el.data('href');

    if (link) {
      e.stopPropagation();

      var urls = [];
      if (link.indexOf(GITHUBCOM) === 0) {
        urls = [
          link + fileExtension,
          link + '/index' + fileExtension,
          link.replace('blob', 'tree')
        ];
      } else {
        urls = link.split(',');
      }

      $el.addClass('tooltipped tooltipped-e').attr('aria-label', 'Loading ...');
      attemptToLoadURL($, urls, function(link) {
        if (link) {
          window.location.href = link;
        } else {
          $el.attr('aria-label', SORRY);
        }
      });
    }
  });
};

module.exports = function($, url, cb) {

  var $requires, $coffeeRequires, $item, name, link, resolveLink;
  var result = [];
  var type = utils.requireType(url);

  // Search for require dom elements
  $requires = $('span.nx').filter(function() {
    return $(this).text() === 'require';
  }).next().next('[class^="s"]');

  if (type === 'coffee') {
    $coffeeRequires = $('span.nx').filter(function() {
      return $(this).text() === 'require';
    }).next('[class^="s"]');
    $requires = $.merge($coffeeRequires, $requires);
  }

  $requires.each(function(index, item) {
    $item = $(item);

    name = utils.stripQuotes($item);
    link = getRequireLink(url, name);
    resolveLink = false;

    if ( link.indexOf(RESOLVE_INDICATOR) === 0) {
      link = link.replace(RESOLVE_INDICATOR, '');
      resolveLink = true;
      $item.wrap('<a class="github-linker" data-href="' + link + '">');
    } else {
      $item.wrap('<a class="github-linker" href="' + link + '">');
    }

    result.push({
      el: $item,
      name: name,
      link: link,
      resolveLink: resolveLink
    });
  });

  registerClickListener($, type);

  cb(null, result);
};
