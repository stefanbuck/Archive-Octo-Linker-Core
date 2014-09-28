/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var util = require('util');

module.exports = function($) {

  if ($('.github-linker-intro').length === 0) {

    var message = 'The GitHub-Linker Chrome extension has some improvements for you! %s';
    var changelogLink = '<a href="https://github.com/stefanbuck/github-linker/blob/master/CHANGELOG.md#changelog">Read more</a>';
    var messageHTML = util.format(message, changelogLink);

    var $intro = $('<div class="github-linker-intro flash flash-notice"><span class="octicon octicon-x flash-close js-flash-close"></span>' + messageHTML + '</div>');
    $('.wrapper').prepend($intro);
  }
};
