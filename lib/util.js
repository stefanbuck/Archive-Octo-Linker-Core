'use strict';

var stripQuotes = function(jqElement) {
  return jqElement.html().replace(/"|'/g, '');
};

module.exports = {
  stripQuotes: stripQuotes
};
