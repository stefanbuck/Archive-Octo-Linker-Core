'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('composer.json', function() {

  this.timeout(4000);

  before(function(done) {
    this.$ = this.result = null;

    helper('composer.json', function(_jquery, _result) {
      this.$ = _jquery;
      this.result = _result;
      done();
    }.bind(this));
  });

  it('found dependencies', function() {
    // TODO Evaluate why this doesn't work
    // this.result.should.have.length(7);
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
    this.$('a.github-linker').length.should.equal(4);
  });

  describe('require', function() {

    it('link php', function() {
      var item = _.findWhere(this.result, {
        name: 'php'
      });

      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });

    it('link laravel/framework', function() {
      var item = _.findWhere(this.result, {
        name: 'laravel/framework'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('https://github.com/laravel/framework');

      item.el.attr('href').should.equal('https://github.com/laravel/framework');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('link unknown-package-name', function() {
      var item = _.findWhere(this.result, {
        name: 'unknown-package-name'
      });

      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });
  });

  describe('require-dev', function() {

    it('link phpunit/phpunit', function() {
      var item = _.findWhere(this.result, {
        name: 'phpunit/phpunit'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('https://github.com/sebastianbergmann/phpunit');

      item.el.attr('href').should.equal('https://github.com/sebastianbergmann/phpunit');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('link doctrine/dbal', function() {
      var item = _.findWhere(this.result, {
        name: 'doctrine/dbal'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('https://github.com/doctrine/dbal');

      item.el.attr('href').should.equal('https://github.com/doctrine/dbal');
      item.el.hasClass('tooltipped').should.be.false;
    });
  });

  describe('suggest', function() {

    it('link ext-openssl', function() {
      var item = _.findWhere(this.result, {
        name: 'ext-openssl'
      });

      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });

    it('doctrine/dbal', function() {
      var item = this.result[this.result.length - 1];

      (item.link === null).should.equal(false);
      item.link.should.equal('https://github.com/doctrine/dbal');

      item.el.attr('href').should.equal('https://github.com/doctrine/dbal');
      item.el.hasClass('tooltipped').should.be.false;
    });
  });
});
