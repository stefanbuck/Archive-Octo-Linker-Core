'use strict';

var githubLinkerCore = require('../');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('manifest', function() {

  describe('package.json', function() {

    describe('remote', function() {

      this.timeout(4000);

      var $, result;
      var url = 'https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/manifest/package.json';

      before(function(done) {
        $ = result = null;

        env(url, function(err, window) {
          if (err) {
            return done(err);
          }
          $ = require('jquery')(window);
          githubLinkerCore($, url, function(err, _result) {
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
        // result.should.have.length(10);

        result.length.should.equal(10);
      });

      it('check order', function() {
        result.length.should.equal(10);
        var pkgNames = ['lodash', 'request', 'modernizr', 'backbone', 'jquery', 'unknown-package-name', 'chai', 'gulp', 'yo', 'should'];
        _.each(result, function(item, index) {
          item.name.should.equal( pkgNames[index] );
        });
      });

      it('check link replacement', function() {
        $('a.github-linker').length.should.equal(10);
      });

      it('link https://github.com/lodash/lodash', function() {
        var item = _.findWhere(result, {
          name: 'lodash'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://github.com/lodash/lodash');
      });

      it('link https://www.npmjs.org/package/request', function() {
        var item = _.findWhere(result, {
          name: 'request'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://www.npmjs.org/package/request');
      });

      it('link https://github.com/Modernizr/Modernizr', function() {
        var item = _.findWhere(result, {
          name: 'modernizr'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://github.com/Modernizr/Modernizr');
      });

      it('link https://github.com/jashkenas/backbone/tree/master', function() {
        var item = _.findWhere(result, {
          name: 'backbone'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://github.com/jashkenas/backbone/tree/master');
      });

      it('link https://github.com/jquery/jquery/tree/1.x-master', function() {
        var item = _.findWhere(result, {
          name: 'jquery'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://github.com/jquery/jquery/tree/1.x-master');
      });

      it('link https://www.npmjs.org/package/unknown-package-name', function() {
        var item = _.findWhere(result, {
          name: 'unknown-package-name'
        });

        (item.link === null).should.equal(false);
        item.link.should.equal('https://www.npmjs.org/package/unknown-package-name');
      });
    });
  });
});
