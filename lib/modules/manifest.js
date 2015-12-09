'use strict';

var utils = require('../util/util.js');

var getType = function(url) {
  var lookup = {
    '/package.json': 'npm',
    '/bower.json': 'bower',
    '/composer.json': 'composer'
  };
  return utils.urlMatch(url, lookup);
};

var getRootElement = function($, content) {
  return $('span.pl-s').filter(function(){
    var $el = $(this);
    return utils.stripQuotes($el) === content && $el.index() === 0;
  });
};

var valueToLink = function($, content) {
  var $el = getRootElement($, content);

  if ($el && $el.length > 0) {
    $el = $el.next('*:not(".octo-linker")');

    if ($el && $el.length > 0) {
      var entryFile = utils.stripQuotes($el);
      if (entryFile) {
        $el.wrap('<a class="octo-linker" href="' + entryFile + '">');
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
      $dir = $dirname.find('.pl-s').eq(1);
      if (!$dir || !$dir.length) {
        return;
      }
      var entryFile = utils.stripQuotes($dir);
      if (entryFile) {
        $dir.wrap('<a class="octo-linker" href="' + entryFile + '">');
      }

      $dirname = $dirname.next();
    }
  }
};

var dependencieField = function(root, type) {
  var $root, $row, $item, $version, name, version;
  var selectors = [];
  var $link;
  var $ = root.$;
  var locationUrl = root.location.href;

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
      $item = $row.find('.pl-s').eq(0);
      $version = $row.find('.pl-s').eq(1);

      if (!$item.length || !$version.length) {
        return;
      }

      name = utils.stripQuotes($item);
      version = utils.stripQuotes($version);

      $link = $('<span class="octo-linker">');
      $link.data({
        value: name,
        locationUrl: locationUrl,
        version: version,
        type: type
      });

      $item = $item.wrap($link).parent();

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

function supported(root, cb) {
  cb(null, !!getType(root.location.href));
}

function init(root, options, cb) {
  var url = root.location.href;
  var $ = root.$;

  var type = getType(url);
  if (type === 'npm') {
    directoriesField($);
  }
  var result = dependencieField(root, type);
  // put them below dependencieField to avoid conflict
  mainField($, type);
  binField($, type);

  cb(null, result);
}

module.exports =  function(root, options, cb) {
  supported(root, function(err, invoke) {
    if (err) {
      return cb(err);
    }
    if (!invoke) {
      return cb(null);
    }
    init(root, options, cb);
  });
};
