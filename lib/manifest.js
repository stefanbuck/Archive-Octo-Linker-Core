/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var linkBuilder = require('./link_builder').manifest;
var utils = require('./utils');

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

var mainField = function($, type) {
  if (type === 'npm' || type === 'bower') {
    var $main = $('span.nt').filter(function() {
      return $(this).text().replace(/"|'/g, '') === 'main';
    }).next().next('[class^="s"]');
    if ($main.length > 0) {
      var entryFile = utils.stripQuotes($main);
      if (entryFile) {
        $main.wrap('<a class="github-linker" href="' + entryFile + '">');
      }
    }
  }
};

var directoriesField = function($) {
  var $dirname, $dir;
  var $directories = $('.nt').filter(function(){
    return $(this).text().replace(/"|'/g, '') === 'directories';
  });

  if ($directories && $directories.length > 0) {
    $dirname = $directories.closest('tr').next();

    while ($dirname) {
      $dir = $dirname.find('.nt').next().next('[class^="s"]');
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
    $root = $('.nt').filter(function() {
      return $(this).text().replace(/"|'/g, '') === selector;
    });

    if (!$root || $root.length === 0) {
      return;
    }

    $row = $root.closest('tr').next();

    while ($row) {
      $item = $row.find('.nt');
      $version = $row.find('.s2');

      if (!$item.length || !$version.length) {
        return;
      }

      name = utils.stripQuotes($item);
      version = utils.stripQuotes($version);

      link = linkBuilder(type, name, version);

      if (link) {
        $item = $item.wrap('<a class="github-linker" href="' + link + '">').parent();
      } else {
        $item.addClass('tooltipped tooltipped-e').attr('aria-label', SORRY);
      }

      result.push({
        el: $item,
        version: version,
        name: name,
        link: link
      });

      $row = $row.next();
    }
  });
  return result;
};

var init = function($, url, cb) {

  var type = getType(url);
  if (type === 'npm') {
    directoriesField($);
  }
  var result = dependencieField($, type);
  
  mainField($, type);

  cb(null, result);
};

module.exports =  {
  init: init,
  supported: supported
};
