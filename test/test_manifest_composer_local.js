'use strict';

var githubLinkerCore = require('../');
var fs = require('fs');
var path = require('path');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('manifest', function() {

  describe('composer.json', function() {

    describe('local', function() {
      var $, result;
      var url = 'https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/composer.json';
      var file = path.resolve(__dirname, 'fixtures/composer.json.html');

      before(function(done) {
        $ = result = null;
        var html = fs.readFileSync(file, 'utf-8');

        env(html, function(err, window) {
          if (err) {
            return done(err);
          }
          $ = require('jquery')(window);

          githubLinkerCore(window, $, url, function(err, _result) {
            if (err) {
              throw err;
            }
            result = _result;
            done();
          });
        });
      });

      it('found dependencies', function() {

        // TODO Evaluate why this doesn't work
        // result.should.have.length(7);
        result.length.should.equal(7);
      });

      it('check order', function() {
        result.length.should.equal(7);
        var pkgNames = ['php', 'laravel/framework', 'unknown-package-name', 'phpunit/phpunit', 'doctrine/dbal', 'ext-openssl', 'doctrine/dbal'];
        _.each(result, function(item, index) {
          item.name.should.equal( pkgNames[index] );
        });
      });

      it('check link replacement', function() {
        $('a.github-linker').length.should.equal(4);
      });

      describe('require', function() {

        it('link php', function() {
          var item = _.findWhere(result, {
            name: 'php'
          });

          (item.link === '').should.equal(true);
          item.el.hasClass('tooltipped').should.be.true;
        });

        it('link laravel/framework', function() {
          var item = _.findWhere(result, {
            name: 'laravel/framework'
          });

          (item.link === null).should.equal(false);
          item.link.should.equal('https://github.com/laravel/framework');

          item.el.attr('href').should.equal('https://github.com/laravel/framework');
          item.el.hasClass('tooltipped').should.be.false;
        });

        it('link unknown-package-name', function() {
          var item = _.findWhere(result, {
            name: 'unknown-package-name'
          });

          (item.link === '').should.equal(true);
          item.el.hasClass('tooltipped').should.be.true;
        });
      });

      describe('require-dev', function() {

        it('link phpunit/phpunit', function() {
          var item = _.findWhere(result, {
            name: 'phpunit/phpunit'
          });

          (item.link === null).should.equal(false);
          item.link.should.equal('https://github.com/sebastianbergmann/phpunit');

          item.el.attr('href').should.equal('https://github.com/sebastianbergmann/phpunit');
          item.el.hasClass('tooltipped').should.be.false;
        });

        it('link doctrine/dbal', function() {
          var item = _.findWhere(result, {
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
          var item = _.findWhere(result, {
            name: 'ext-openssl'
          });

          (item.link === '').should.equal(true);
          item.el.hasClass('tooltipped').should.be.true;
        });

        it('doctrine/dbal', function() {
          var item = result[result.length - 1];

          (item.link === null).should.equal(false);
          item.link.should.equal('https://github.com/doctrine/dbal');

          item.el.attr('href').should.equal('https://github.com/doctrine/dbal');
          item.el.hasClass('tooltipped').should.be.false;
        });
      });

    });
  });
});
