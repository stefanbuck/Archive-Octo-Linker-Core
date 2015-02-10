'use strict';

var util = require('util');

var root;

function isNewVersion(version) {
  var installedVersion = root.localStorage.getItem('github-linker-version');
  if (installedVersion !== version) {
    root.localStorage.setItem('github-linker-version', version);
    if (installedVersion) {
      return true;
    }
  }
  return false;
}

function getUser () {
  var el = root.document.querySelector('.header .css-truncate-target');
  if (el && el.innerHTML.length) {
    return ' ' + el.innerHTML;
  }
  return '';
}

module.exports = function(window, options) {
  root = window;
  var $ = root.$;

  if (!options.showUpdateNotification) {
    return;
  }

  if (isNewVersion(options.version)) {
    if ($('.github-linker-intro').length === 0) {

      var message = 'Hi%s, a new version of the GitHub-Linker extension has been released! %s';
      var changelogLink = '<a href="' + options.changelog + '">Read more</a>';
      var messageHTML = util.format(message, getUser(), changelogLink);

      var $intro = $('<div class="github-linker-intro flash flash-notice"><span class="octicon octicon-x flash-close js-flash-close"></span>' + messageHTML + '</div>');
      $('.wrapper').prepend($intro);
    }
  }
};
