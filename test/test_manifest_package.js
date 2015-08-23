'use strict';

var assert = require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('package.json', function() {

  this.timeout(4000);

  before(function(done) {
    helper('package.json', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.manifest;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
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
    $('.github-linker').length.should.equal(14);
  });

  it('link https://github.com/lodash/lodash', function() {
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('lodash');
  });

  it('link https://www.npmjs.org/package/request', function() {
    var item = _.findWhere(this.result, {
      name: 'request'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('request');
  });

  it('link https://github.com/Modernizr/Modernizr', function() {
    var item = _.findWhere(this.result, {
      name: 'modernizr'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('modernizr');
  });

  it('link https://github.com/jashkenas/backbone/tree/master', function() {
    var item = _.findWhere(this.result, {
      name: 'backbone'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('backbone');
  });

  it('link https://github.com/jquery/jquery/tree/1.x-master', function() {
    var item = _.findWhere(this.result, {
      name: 'jquery'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('jquery');
  });

  it('link https://www.npmjs.org/package/unknown-package-name', function() {
    var item = _.findWhere(this.result, {
      name: 'unknown-package-name'
    });

    item.el.data('type').should.equal('npm');
    item.el.data('value').should.equal('unknown-package-name');
  });

  it('link directories', function() {
    $('.github-linker[href="./main"]').length.should.equal(1);
    $('.github-linker[href="./bin"]').length.should.equal(1);
  });

  it('entry file', function() {
    $('.github-linker[href="index.js"]').length.should.equal(1);
  });

  it('bin file', function() {
    $('.github-linker[href="./index.js"]').length.should.equal(1);
  });
});
