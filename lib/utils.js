'use strict';

var _ = require('lodash');

var getType = function(url, lookup) {

  var urlContains = function(indicator) {
    return url.indexOf(indicator) === url.length - indicator.length;
  };

  return _.find(lookup, function(type, urlFragment) {
    return urlContains(urlFragment);
  });
};

var stripQuotes = function(jqElement) {
  return jqElement.html().replace(/"|'/g, '');
};

var manifestType = function(url) {
  var lookup = {
    '/package.json': 'npm',
    '/bower.json': 'bower',
    '/composer.json': 'composer'
  };
  return getType(url, lookup);
};

var requireType = function(url) {
  var lookup = {
    '.js': 'js',
    '.coffee': 'coffee'
  };
  return getType(url, lookup);
};

var showLoader = function($) {
  var $loaderContainer = $('.page-context-loader');
  $loaderContainer.addClass('is-context-loading');
};

module.exports = {
  stripQuotes: stripQuotes,
  manifestType: manifestType,
  requireType: requireType,
  showLoader: showLoader
};
