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

module.exports = function(window, options) {
  root = window;
  var $ = root.$;

  if (!options.showUpdateNotification) {
    return;
  }

  if (isNewVersion(options.version)) {
    if ($('.github-linker-intro').length === 0) {

      var message = 'The GitHub-Linker Chrome extension has some improvements for you! %s';
      var changelogLink = '<a href="' + options.changelog + '">Read more</a>';
      var messageHTML = util.format(message, changelogLink);

      var $intro = $('<div class="github-linker-intro flash flash-notice"><span class="octicon octicon-x flash-close js-flash-close"></span>' + messageHTML + '</div>');
      $('.wrapper').prepend($intro);
    }
  }
};
