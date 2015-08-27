'use strict';

var path = require('path');
var util = require('util');
var utils = require('../util/util.js');
var builtins = require('builtins');
var glResolve = require('github-linker-resolver');

var LIVE_RESOLVER = 'https://githublinker.herokuapp.com/q/%s/%s';
var NODEJS_API = 'https://nodejs.org/api/%s.html';
var NPM_API = 'https://www.npmjs.org/package/%s';

var SORRY = 'Can\'t resolve this require for you, sorry.';
var LOADING = 'Loading ...';
var RESOLVED = 'Redirecting ...';

function loader(urls, options, cb) {
  options = options || {};
  options.type = options.type || 'GET';
  if (typeof urls === 'string') {
    urls = [urls];
  }
  var url = urls.shift();

  $.ajax({
    type: options.type,
    url: url}
  ).then(function(body) {
    cb(null, body, url);
  }).fail(function(xhr) {
    if (urls.length) {
      return loader(urls, options, cb);
    }
    cb(xhr);
  });
}

var getType = function(url) {
  var lookup = {
    '.js': ['js', 'es6', 'jsx'],
    '.jsx': ['js', 'es6', 'jsx'],
    '.es6': ['js', 'es6', 'jsx'],
    '.coffee': ['coffee']
  };
  return utils.urlMatch(url, lookup);
};

function openUrl(url, newWindow) {
  var target = '_self';
  if (newWindow) {
    target = '_blank';
  }
  global.open(url, target);
}

function clickHandler(e) {
  var newWindow = e.metaKey;
  var $target = $(e.currentTarget);
  var data = $target.data();
  if (data.type) {
    if (!$target.hasClass('tooltipped')) {
      $target.addClass('tooltipped tooltipped-e');
    }
    $target.attr('aria-label', LOADING);

    // Redirect to nodejs api
    if (data.type === 'npm' && builtins.indexOf(data.value) > -1) {
      return openUrl(util.format(NODEJS_API, data.value), newWindow);
    }

    if (data.value === '.' || data.value.indexOf('...') === 0) {
      return $target.attr('aria-label', SORRY);
    }

    // Get url from static informations
    var resolveResult = glResolve(data.value, data.locationUrl);
    if (resolveResult) {
      var urls = [];

      var fileExtensions = getType(data.locationUrl);

      if (fileExtensions && resolveResult.indexOf('https://github.com') === 0) {
        if (!path.extname(resolveResult)) {
          fileExtensions.forEach(function(ext){
            urls.push(resolveResult + '.' + ext);
          });
        }
        fileExtensions.forEach(function(ext){
          urls = urls.concat([
            resolveResult + '/index.' + ext,
            resolveResult.replace('blob', 'tree')
          ]);
        });
      } else {
        urls.push(resolveResult);
      }

      return loader(urls, {type: 'HEAD'}, function(err, body, url) {
        if (err) {
          $target.attr('aria-label', SORRY);
          return;
        }
        $target.attr('aria-label', RESOLVED);
        openUrl(url, newWindow);
      });
    }

    loader(util.format(LIVE_RESOLVER, data.type, data.value), {type: 'GET'}, function(err, body) {
      if (err) {
        if (data.type === 'npm') {
          return openUrl(util.format(NPM_API, data.value), newWindow);
        }
        $target.attr('aria-label', SORRY);
      }

      if (body.url) {
        $target.attr('aria-label', RESOLVED);
        return openUrl(body.url, newWindow);
      }

      $target.attr('aria-label', SORRY);
    });
  }
}

module.exports = function() {
  $('body').undelegate('.github-linker', 'click', clickHandler);
  $('body').delegate('.github-linker', 'click', clickHandler);
};
