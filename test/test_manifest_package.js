'use strict';

var assert = require('should');
var _ = require('lodash');
var helper = require('./helper');
var registries = require('github-linker-cache');

describe('package.json', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    registries.npm = {
      lodash: 'https://github.com/lodash/lodash'
    };

    helper('package.json', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    // TODO Evaluate why this doesn't work
    // this.result.should.have.length(10);
    this.result.length.should.equal(10);
  });

  it('check order', function() {
    this.result.length.should.equal(10);
    var pkgNames = ['lodash', 'request', 'modernizr', 'backbone', 'jquery', 'unknown-package-name', 'chai', 'gulp', 'yo', 'should'];
    _.each(this.result, function(item, index) {
      item.name.should.equal( pkgNames[index] );
    });
  });

  it('check link replacement', function() {
    this.$('a.github-linker').length.should.equal(14);
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

  it('link https://www.npmjs.org/package/request', function() {
    var item = _.findWhere(this.result, {
      name: 'request'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://www.npmjs.org/package/request');

    item.el.attr('href').should.equal('https://www.npmjs.org/package/request');
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

  it('link https://www.npmjs.org/package/unknown-package-name', function() {
    var item = _.findWhere(this.result, {
      name: 'unknown-package-name'
    });

    (item.link === null).should.equal(false);
    item.link.should.equal('https://www.npmjs.org/package/unknown-package-name');

    item.el.attr('href').should.equal('https://www.npmjs.org/package/unknown-package-name');
    item.el.hasClass('tooltipped').should.be.false;
  });

  it('link directories', function() {
    this.$('a.github-linker[href="./main"]').length.should.equal(1);
    this.$('a.github-linker[href="./bin"]').length.should.equal(1);
  });

  it('entry file', function() {
    this.$('a.github-linker[href="index.js"]').length.should.equal(1);
  });

  it('bin file', function() {
    this.$('a.github-linker[href="./index.js"]').length.should.equal(1);
  });
});
