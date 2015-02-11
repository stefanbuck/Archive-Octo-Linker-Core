'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe.skip('require pull', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('require_pull', 'pull/9/files', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    // TODO Evaluate why this doesn't work
    // result.should.have.length(2);
    this.result.length.should.equal(2);
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
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.link.should.equal('https://github.com/lodash/lodash');

    item.el.attr('href').should.equal('https://github.com/lodash/lodash');
    item.el.hasClass('tooltipped').should.be.false;
  });
});
