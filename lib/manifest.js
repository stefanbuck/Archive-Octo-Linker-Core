/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var registries = require('github-linker-registries');
var utils = require('./utils');

var SORRY = 'Sorry, there is no link for this package available';

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
  var registryList = registries[type];

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

      link = registryList[name];
      if (version.split('/').length === 2) {
        link = 'https://github.com/' + version.replace('#', '/tree/');

      } else if (!link) {

        if (type === 'npm') {
          link = 'https://www.npmjs.org/package/' + name;
        } else if (type === 'bower') {
          link = 'http://bower.io/search/?q=' + name;
        }
      }

      if (link) {
        $item = $item.wrap('<a class="github-linker" href="' + link + '">').parent();
      } else {
        $item.addClass('tooltipped tooltipped-e').attr('aria-label', SORRY);
      }

      result.push({
        el: $item,
        version: version,
        name: name,
        link: link || null
      });

      $row = $row.next();
    }
  });
  return result;
};

module.exports = function($, url, cb) {

  var type = utils.manifestType(url);

  var result = dependencieField($, type);
  mainField($, type);

  cb(null, result);
};
