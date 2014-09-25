'use strict';

var _ = require('lodash');

var urlMatch = function(url, lookup) {

  var urlContains = function(indicator) {
    url = url.split('#')[0];
    return url.indexOf(indicator) === url.length - indicator.length;
  };

  return _.find(lookup, function(type, urlFragment) {
    return urlContains(urlFragment);
  });
};

var stripQuotes = function(jqElement) {
  return jqElement.html().replace(/"|'/g, '');
};

var showLoader = function($) {
  var $loaderContainer = $('.page-context-loader');
  $loaderContainer.addClass('is-context-loading');
};

var runInBrowser = function(global) {
  if (typeof global.chrome === 'object') {
    return true;
  }
  return false;
};

module.exports = {
  stripQuotes: stripQuotes,
  urlMatch: urlMatch,
  showLoader: showLoader,
  runInBrowser: runInBrowser,
};
