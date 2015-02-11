'use strict';

var util = require('util');

var root;

function getUser () {
  var el = root.document.querySelector('.header .css-truncate-target');
  if (el && el.innerHTML.length) {
    return ' ' + el.innerHTML;
  }
  return '';
}

module.exports = function(window, options) {
  if (!options.showUpdateNotification) {
    return;
  }

  root = window;
  var $ = root.$;

  if ($('.github-linker-intro').length > 0) {
    return;
  }

  var message = 'Hi%s, a new version of the GitHub-Linker extension has been released! %s';
  var changelogLink = '<a href="' + options.changelog + '">Read more</a>';
  var messageHTML = util.format(message, getUser(), changelogLink);

  var $intro = $('<div class="github-linker-intro flash flash-notice"><span class="octicon octicon-x flash-close js-flash-close"></span>' + messageHTML + '</div>');
  $('.wrapper').prepend($intro);
};
