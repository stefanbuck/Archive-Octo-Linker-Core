'use strict';

require('should');
var core = require('..');

describe('core', function() {
  var fakeWindow = {
    document: {
      getElementById: function() {}
    }
  };

  it('require argument window', function () {
    core.bind(null).should.throw('Missing argument window');
  });

  it('require option changelog', function () {
    core.bind(null, fakeWindow, {version: '1.2.3'}).should.throw('Missing option changelog');
  });
});
