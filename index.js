'use strict';

var _ = require('lodash');
var GitHubLinkerCore = require('./lib/core.js');

function spyInject(global, cb, context) {
  cb = _.debounce(cb, 250).bind(context);

  var domElement = global.document.getElementById('js-repo-pjax-container');
  if (!domElement || !global.MutationObserver) {
    return cb();
  }

  var viewSpy = new global.MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === 'childList' && mutation.addedNodes.length) {
        cb();
      }
    });
  });

  viewSpy.observe(domElement, {
    attributes: true,
    childList: true,
    characterData: true
  });

  cb();
}

module.exports  = function(global, options, cb) {
  var instance  = new GitHubLinkerCore(global, options);
  spyInject(global, function() {
    instance.init(cb);
  }, instance);

  return instance;
};
