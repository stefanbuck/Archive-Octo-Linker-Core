'use strict';

require('should');
var helper = require('./helper');

describe('spyInject', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('bower.json', done);
  });

  it('dom element is present', function() {
    $('#js-repo-pjax-container').length.should.equal(1);
  });
});
