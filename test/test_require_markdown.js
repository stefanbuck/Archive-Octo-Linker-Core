'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('require_markdown.md', function() {

  this.timeout(4000);

  before(function(done) {
    helper('require_markdown.md', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.require;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    this.result.length.should.equal(1);
  });

  it('check link replacement', function() {
    $('.github-linker').length.should.equal(1);
  });

  it('https://github.com/lodash/lodash', function() {
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('lodash');
  });

});
