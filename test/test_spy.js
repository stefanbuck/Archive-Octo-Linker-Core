'use strict';

require('should');
var helper = require('./helper');

describe('spyInject', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('bower.json', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('dom element is present', function() {
    this.$('#js-repo-pjax-container').length.should.equal(1);
  });
});
