'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('require.es6', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('require.es6', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result.require;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    // TODO Evaluate why this doesn't work
    // result.should.have.length(4);
    this.result.length.should.equal(4);
  });

  it('http://iojs.org/api/path.html', function() {
    var item = _.findWhere(this.result, {
      name: 'path'
    });

    item.link.should.equal('http://iojs.org/api/path.html');

    item.el.attr('href').should.equal('http://iojs.org/api/path.html');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('https://github.com/lodash/lodash', function() {
    var items = _.where(this.result, {
      name: 'lodash'
    });

    items.forEach(function(item) {
      item.link.should.equal('https://github.com/lodash/lodash');

      item.el.attr('href').should.equal('https://github.com/lodash/lodash');
      item.el.hasClass('tooltipped').should.be.false;
    });
  });
});
