/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var util = require('util');
var linkBuilder = require('./link_builder');
var utils = require('./utils');
var liveResolver = require('./live-resolver/index');

var GITHUBCOM = 'https://github.com';
var SORRY = 'Can\'t resolve this require for you, sorry.';
var RESOLVE_INDICATOR = 'resolve:';

var getType = function(url) {
  var lookup = {
    '.js': 'js',
    '.jsx': 'js',
    '.coffee': 'coffee'
  };
  return utils.urlMatch(url, lookup);
};

var supported = function(url) {
  return !!getType(url);
};

function isLocalPath(val) {
  if (val === '..') {
    return true;
  }

  var result = val.match(/^(\.\/|\.\.\/)/gm);
  if (result && result.length > 0) {
    return true;
  }

  return false;
}

var init = function(window, url, cb) {
  var $ = window.$;

  liveResolver(window);

  var $requires, $item, name, link, resolveLink;
  var result = [];
  var type = getType(url);

  // Search for require dom elements
  $requires = $('.pl-s3').filter(function() {
    return $(this).text().indexOf('require') > -1;
  }).siblings('.pl-s1');

  $requires.each(function(index, item) {
    $item = $(item);

    name = utils.stripQuotes($item);
    link = linkBuilder('require', {
      name: name,
      url: url
    });

    if (isLocalPath(name)) {
      $item = $item.wrap(util.format('<a class="github-linker github-linker-live-resolver" data-type="%s" data-value="%s">', 'filesystem', link)).parent();
    } else if (link) {
      $item = $item.wrap('<a class="github-linker" href="' + link + '">').parent();
    } else {
      $item = $item.wrap(util.format('<a class="github-linker github-linker-live-resolver" data-type="%s" data-value="%s">', 'require', name)).parent();
    }

    result.push({
      el: $item,
      name: name,
      link: link,
      resolveLink: resolveLink
    });
  });

  cb(null, result);
};

module.exports =  {
  init: init,
  supported: supported
};
