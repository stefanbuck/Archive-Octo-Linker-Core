'use strict';

var path = require('path');
var linkBuilder = require('../util/link_builder').require;
var utils = require('../util/util.js');

var GITHUBCOM = 'https://github.com';
var SORRY = 'Can\'t resolve this require for you, sorry.';
var RESOLVE_INDICATOR = 'resolve:';

var getType = function(url) {
  var lookup = {
    '.js': ['js', 'es6', 'jsx'],
    '.jsx': ['js', 'es6', 'jsx'],
    '.es6': ['js', 'es6', 'jsx'],
    '.coffee': ['coffee']
  };
  return utils.urlMatch(url, lookup);
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

var registerClickListener = function($, fileExtensions) {

  $('body').on('click', 'a.github-linker', function(e) {
    utils.showLoader($);
    var $el = $(this);
    var link = $el.data('href');

    if (link) {
      e.stopPropagation();

      var urls = [];
      if (link.indexOf(GITHUBCOM) === 0) {
        if (path.extname(link)) {
          urls.push(link);
        } else {
          fileExtensions.forEach(function(ext){
            urls.push(link + '.' + ext);
          });
        }
        fileExtensions.forEach(function(ext){
          urls = urls.concat([
            link + '/index.' + ext,
            link.replace('blob', 'tree')
          ]);
        });
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

function supported(root, cb) {
  var isGist = !!root.$('.gist-content').length;
  var isRepo = !!root.$('.repository-content').length;

  if (isRepo || isGist) {
    return cb(null, true);
  }
  cb(null, false);
}

function init(root, options, cb) {
  var url = root.location.href;
  var $ = root.$;

  var $requires, $item, name, link, resolveLink;
  var result = [];
  var types = getType(url);

  // Search for require dom elements
  $requires = $('.pl-c1, .pl-k').filter(function() {
    return !!$(this).text().match(/(require|import|export)/);
  }).siblings('.pl-s');

  $requires.each(function(index, item) {
    $item = $(item);

    name = utils.stripQuotes($item);
    link = linkBuilder(url, name);
    resolveLink = false;

    if (link) {
      if ( link.indexOf(RESOLVE_INDICATOR) === 0) {
        link = link.replace(RESOLVE_INDICATOR, '');
        resolveLink = true;
        $item = $item.wrap('<a class="github-linker" data-href="' + link + '">').parent();
      } else {
        $item = $item.wrap('<a class="github-linker" href="' + link + '">').parent();
      }
    } else {
      $item.addClass('tooltipped tooltipped-e').attr('aria-label', SORRY);
    }

    result.push({
      el: $item,
      name: name,
      link: link,
      resolveLink: resolveLink
    });
  });

  registerClickListener($, types);

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
