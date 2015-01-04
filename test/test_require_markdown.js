'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('require_markdown.md', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('require_markdown.md', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    this.result.length.should.equal(1);
  });

  it('check link replacement', function() {
    this.$('a.github-linker').length.should.equal(1);
  });

  it('https://github.com/lodash/lodash', function() {
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.link.should.equal('https://github.com/lodash/lodash');

    item.el.attr('href').should.equal('https://github.com/lodash/lodash');
    item.el.hasClass('tooltipped').should.be.false;
  });

});
