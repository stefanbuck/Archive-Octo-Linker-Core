'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');
// var registries = require('octo-linker-cache');

describe('bower.json', function() {

  this.timeout(4000);

  before(function(done) {
    helper('bower.json', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.manifest;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
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
    $('.octo-linker').length.should.equal(9);
  });

  it('link https://github.com/lodash/lodash', function() {
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.el.data('type').should.equal('bower');
    item.el.data('value').should.equal('lodash');
  });

  it('link https://github.com/Modernizr/Modernizr', function() {
    var item = _.findWhere(this.result, {
      name: 'modernizr'
    });

    item.el.data('type').should.equal('bower');
    item.el.data('value').should.equal('modernizr');
  });

  it('link https://github.com/jashkenas/backbone/tree/master', function() {
    var item = _.findWhere(this.result, {
      name: 'backbone'
    });

    item.el.data('type').should.equal('bower');
    item.el.data('value').should.equal('backbone');
  });

  it('link https://github.com/jquery/jquery/tree/1.x-master', function() {
    var item = _.findWhere(this.result, {
      name: 'jquery'
    });

    item.el.data('type').should.equal('bower');
    item.el.data('value').should.equal('jquery');
  });

  it('link http://bower.io/search/?q=unknown-package-name', function() {
    var item = _.findWhere(this.result, {
      name: 'unknown-package-name'
    });

    item.el.data('type').should.equal('bower');
    item.el.data('value').should.equal('unknown-package-name');
  });

  it('entry file', function() {
    $('.octo-linker[href="index.js"]').length.should.equal(1);
  });
});
