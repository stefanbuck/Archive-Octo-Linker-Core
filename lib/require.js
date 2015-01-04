/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');
var linkBuilder = require('./link_builder').require;
var utils = require('./utils');

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
        if (path.extname(link)) {
          urls.push(link);
        } else {
          urls.push(link + fileExtension);
        }
        urls = urls.concat([
          link + '/index' + fileExtension,
          link.replace('blob', 'tree')
        ]);
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

var supported = function(url) {
  return !!getType(url);
};

var init = function($, url, cb) {

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

  registerClickListener($, type);

  cb(null, result);
};

module.exports =  {
  init: init,
  supported: supported
};
