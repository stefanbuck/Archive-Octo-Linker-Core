'use strict';

var utils = require('../util/util.js');

function supported(root, cb) {
  var isGist = !!root.$('.gist-content').length;
  var isRepo = !!root.$('.repository-content').length;

  if (isRepo || isGist) {
    return cb(null, true);
  }
  cb(null, false);
}

function init(root, options, cb) {
  var locationUrl = root.location.href;
  var $ = root.$;
  var $requires, $item, name;
  var $link;
  var result = [];

  // Search for require dom elements
  $requires = $('.pl-c1, .pl-k').filter(function() {
    return !!$(this).text().match(/(require|import|export)/);
  }).siblings('.pl-s');

  $requires.each(function(index, item) {
    $item = $(item);

    name = utils.stripQuotes($item);

    $link = $('<span class="octo-linker">');
    $link.data({
      value: name,
      locationUrl: locationUrl,
      type: 'npm'
    });

    $item = $item.wrap($link).parent();

    result.push({
      el: $item,
      name: name
    });
  });

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
