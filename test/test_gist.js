'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe.skip('gist', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('gist', 'https://gist.github.com/petereberlecom/a61cb95f9b28270d86a9', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result.require;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    this.result.length.should.equal(1);
  });

  it('https://github.com/octo-linker/core', function() {
    var item = _.findWhere(this.result, {
      name: 'octo-linker-core'
    });

    item.link.should.equal('https://github.com/octo-linker/core');

    item.el.attr('href').should.equal('https://github.com/octo-linker/core');
    item.el.hasClass('tooltipped').should.be.false;
  });
});
