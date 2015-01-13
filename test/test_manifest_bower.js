'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');
var registries = require('github-linker-cache');

describe('bower.json', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    registries.bower = {
      lodash: 'https://github.com/lodash/lodash'
    };

    helper('bower.json', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    // TODO Evaluate why this doesn't work
    // this.result.should.have.length(10);
    this.result.length.should.equal(8);
  });

  it('check order', function() {
    this.result.length.should.equal(8);
    var pkgNames = ['lodash', 'modernizr', 'backbone', 'jquery', 'unknown-package-name', 'chai', 'should', 'lodash'];
    _.each(this.result, function(item, index) {
      item.name.should.equal( pkgNames[index] );
    });
  });

  it('check link replacement', function() {
    this.$('a.github-linker').length.should.equal(9);
  });

  it('link https://github.com/lodash/lodash', function() {
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://github.com/lodash/lodash');

    item.el.attr('href').should.equal('https://github.com/lodash/lodash');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('link https://github.com/Modernizr/Modernizr', function() {
    var item = _.findWhere(this.result, {
      name: 'modernizr'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://github.com/Modernizr/Modernizr');

    item.el.attr('href').should.equal('https://github.com/Modernizr/Modernizr');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('link https://github.com/jashkenas/backbone/tree/master', function() {
    var item = _.findWhere(this.result, {
      name: 'backbone'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://github.com/jashkenas/backbone/tree/master');

    item.el.attr('href').should.equal('https://github.com/jashkenas/backbone/tree/master');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('link https://github.com/jquery/jquery/tree/1.x-master', function() {
    var item = _.findWhere(this.result, {
      name: 'jquery'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://github.com/jquery/jquery/tree/1.x-master');

    item.el.attr('href').should.equal('https://github.com/jquery/jquery/tree/1.x-master');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('link http://bower.io/search/?q=unknown-package-name', function() {
    var item = _.findWhere(this.result, {
      name: 'unknown-package-name'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('http://bower.io/search/?q=unknown-package-name');
  });

  it('entry file', function() {
    this.$('a.github-linker[href="index.js"]').length.should.equal(1);
  });
});
