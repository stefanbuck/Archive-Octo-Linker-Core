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
  return jqElement.text().replace(/"|'/g, '').trim();
};

var showLoader = function($) {
  $('.page-context-loader').addClass('is-context-loading');
};

module.exports = {
  stripQuotes: stripQuotes,
  urlMatch: urlMatch,
  showLoader: showLoader,
};
