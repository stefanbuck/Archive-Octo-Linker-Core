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
  if (type === 'npm') {
    var $main = $('span.nt:contains("main")').next().next('[class^="s"]');
    if ($main.length > 0) {
      var entryFile = utils.stripQuotes($main);
      if (entryFile) {
        $main.wrap('<a class="github-linker" href="' + entryFile + '">');
      }
    }
  }
};

var dependencieField = function($, type) {
  var $root, $row, $name, $version, name, version, link;
  var selectors = [];
  if (type === 'npm' || type === 'bower') {
    selectors = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  } else if (type === 'composer') {
    selectors = ['require', 'require-dev', 'conflict', 'replace', 'provide', 'suggest'];
  }

  var result = [];
  var registryList = registries[type];

  selectors.forEach(function(selector) {
    $root = $('.nt:contains(\'' + selector + '\')');

    if (!$root || $root.length === 0) {
      return;
    }

    $row = $root.closest('tr').next();

    while ($row) {
      $name = $row.find('.nt');
      $version = $row.find('.s2');

      if (!$name.length || !$version.length) {
        return;
      }

      name = utils.stripQuotes($name);
      version = utils.stripQuotes($version);

      link = registryList[name];

      if (version.split('/').length === 2) {
        link = 'https://github.com/' + version.replace('#', '/tree/');

      } else if (!link && type === 'npm' ) {
        link = 'https://www.npmjs.org/package/' + name;
      }

      if (link) {
        $name.wrap('<a class="github-linker" href="' + link + '">');
      } else {
        $name.addClass('tooltipped tooltipped-e').attr('aria-label', SORRY);
      }

      result.push({
        el: $name,
        version: version,
        name: name,
        link: link
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
