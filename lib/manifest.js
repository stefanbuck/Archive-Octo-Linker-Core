/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var linkBuilder = require('./link_builder');
var util = require('util');
var utils = require('./utils');
var liveResolver = require('./live-resolver/index');

var SORRY = 'Sorry, there is no link for this package available';

var getType = function(url) {
  var lookup = {
    '/package.json': 'npm',
    '/bower.json': 'bower',
    '/composer.json': 'composer'
  };
  return utils.urlMatch(url, lookup);
};

var supported = function(url) {
  return !!getType(url);
};

var getRootElement = function($, content) {
  return $('span.pl-s1').filter(function(){
    var $el = $(this);
    return utils.stripQuotes($el) === content && $el.index() === 0;
  });
};

var valueToLink = function($, content) {
  var $el = getRootElement($, content);

  if ($el && $el.length > 0) {
    $el = $el.next('*:not(".github-linker")');

    if ($el && $el.length > 0) {
      var entryFile = utils.stripQuotes($el);
      if (entryFile) {
        $el.wrap('<a class="github-linker" href="' + entryFile + '">');
      }
    }
  }
};

var mainField = function($, type) {
  if (type === 'npm' || type === 'bower') {
    valueToLink($, 'main');
  }
};

var binField = function($, type) {
  if (type === 'npm') {
    valueToLink($, 'bin');
  }
};

var directoriesField = function($) {
  var $dirname, $dir;
  var $directories = getRootElement($, 'directories');

  if ($directories && $directories.length > 0) {
    $dirname = $directories.closest('tr').next();

    while ($dirname) {
      $dir = $dirname.find('.pl-s1').eq(1);
      if (!$dir || !$dir.length) {
        return;
      }
      var entryFile = utils.stripQuotes($dir);
      if (entryFile) {
        $dir.wrap('<a class="github-linker" href="' + entryFile + '">');
      }

      $dirname = $dirname.next();
    }
  }
};

var dependencieField = function($, type) {
  var $root, $row, $item, $version, name, version, link;
  var selectors = [];
  if (type === 'npm') {
    selectors = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  } else if (type === 'bower') {
    selectors = ['dependencies', 'devDependencies', 'resolutions'];
  } else if (type === 'composer') {
    selectors = ['require', 'require-dev', 'conflict', 'replace', 'provide', 'suggest'];
  }

  var result = [];

  selectors.forEach(function(selector) {
    $root = getRootElement($, selector);

    if (!$root || $root.length === 0) {
      return;
    }

    $row = $root.closest('tr').next();

    while ($row) {
      $item = $row.find('.pl-s1').eq(0);
      $version = $row.find('.pl-s1').eq(1);

      if (!$item.length || !$version.length) {
        return;
      }

      name = utils.stripQuotes($item);
      version = utils.stripQuotes($version);

      link = linkBuilder(type, {
        name: name,
        version: version
      });

      if (link) {
        $item = $item.wrap('<a class="github-linker" href="' + link + '">').parent();
      } else {
        $item = $item.wrap(util.format('<a class="github-linker github-linker-live-resolver" data-type="%s" data-value="%s;%s">', type, name, version)).parent();
      }

      result.push({
        el: $item,
        version: version,
        name: name
      });

      $row = $row.next();
    }
  });
  return result;
};

var init = function(window, url, cb) {
  var $ = window.$;

  liveResolver(window);

  var type = getType(url);
  if (type === 'npm') {
    directoriesField($);
  }
  var result = dependencieField($, type);
  // put them below dependencieField to avoid conflict
  mainField($, type);
  binField($, type);

  cb(null, result);
};

module.exports =  {
  init: init,
  supported: supported
};
