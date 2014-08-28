/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var stripQuotes = function(jqElement) {
  return jqElement.html().replace(/"/g, '');
};

module.exports = function($, type, dictionary, cb) {

  var $root, $row, $name, $version, name, version, link;
  var types = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
  var result = [];
  var registryList = dictionary[type];

  types.forEach(function(selector) {
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

      name = stripQuotes($name);
      version = stripQuotes($version);

      link = registryList[name];

      if (version.split('/').length === 2) {
        link = 'https://github.com/' + version.replace('#', '/tree/');

      } else if (!link && type === 'npm' ) {
        link = 'https://www.npmjs.org/package/' + name;
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

  cb(null, result);
};
