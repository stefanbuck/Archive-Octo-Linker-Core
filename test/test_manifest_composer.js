'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('composer.json', function() {

  this.timeout(4000);

  before(function(done) {
    helper('composer.json', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.manifest;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    this.result.length.should.equal(7);
  });

  it('check order', function() {
    this.result.length.should.equal(7);
    var pkgNames = ['php', 'laravel/framework', 'unknown-package-name', 'phpunit/phpunit', 'doctrine/dbal', 'ext-openssl', 'doctrine/dbal'];
    _.each(this.result, function(item, index) {
      item.name.should.equal( pkgNames[index] );
    });
  });

  it('check link replacement', function() {
    $('.github-linker').length.should.equal(7);
  });

  describe('require', function() {

    it('link php', function() {
      var item = _.findWhere(this.result, {
        name: 'php'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('php');
    });

    it('link laravel/framework', function() {
      var item = _.findWhere(this.result, {
        name: 'laravel/framework'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('laravel/framework');
    });

    it('link unknown-package-name', function() {
      var item = _.findWhere(this.result, {
        name: 'unknown-package-name'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('unknown-package-name');
    });
  });

  describe('require-dev', function() {

    it('link phpunit/phpunit', function() {
      var item = _.findWhere(this.result, {
        name: 'phpunit/phpunit'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('phpunit/phpunit');
    });

    it('link doctrine/dbal', function() {
      var item = _.findWhere(this.result, {
        name: 'doctrine/dbal'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('doctrine/dbal');
    });
  });

  describe('suggest', function() {

    it('link ext-openssl', function() {
      var item = _.findWhere(this.result, {
        name: 'ext-openssl'
      });

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('ext-openssl');
    });

    it('doctrine/dbal', function() {
      var item = this.result[this.result.length - 1];

      item.el.data('type').should.equal('composer');
      item.el.data('value').should.equal('doctrine/dbal');
    });
  });
});
