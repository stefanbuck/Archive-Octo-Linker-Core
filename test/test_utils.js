'use strict';

var utils = require('../lib/utils');
var manifest = require('../lib/manifest');
var reqr = require('../lib/require');
var assert = require('should');

describe('utils', function() {

  describe('manifest.supported', function() {

    it('package.json', function() {
      manifest.supported('https://github.com/stefanbuck/github-linker-core/blob/master/package.json').should.equal(true);
    });

    it('bower.json', function() {
      manifest.supported('https://github.com/stefanbuck/github-linker-core/blob/master/bower.json').should.equal(true);
    });

    it('composer.json', function() {
      manifest.supported('https://github.com/stefanbuck/github-linker-core/blob/master/composer.json').should.equal(true);
    });

    it('unknown.json', function() {
      manifest.supported('https://github.com/stefanbuck/github-linker-core/blob/master/unknown.json').should.equal(false);
    });
  });

  describe('require.supported', function() {

    it('file.js', function() {
      reqr.supported('https://github.com/stefanbuck/github-linker-core/blob/master/file.js').should.equal(true);
    });

    it('file.coffee', function() {
      reqr.supported('https://github.com/stefanbuck/github-linker-core/blob/master/file.coffee').should.equal(true);
    });

    it('file.txt', function() {
      reqr.supported('https://github.com/stefanbuck/github-linker-core/blob/master/file.txt').should.equal(false);
    });
  });

  describe('advanced urls', function() {

    it('with line marker', function() {
      manifest.supported('https://github.com/stefanbuck/github-linker-core/blob/master/package.json#L1').should.equal(true);
      reqr.supported('https://github.com/stefanbuck/github-linker-core/blob/master/file.js#L1').should.equal(true);
    });
  });

  describe('stripQuotes', function() {

    it('lodash', function() {
      utils.stripQuotes({html: function(){return 'lodash';}}).should.equal('lodash');
    });

    it('"lodash"', function() {
      utils.stripQuotes({html: function(){return '"lodash"';}}).should.equal('lodash');
    });

    it('\'lodash\'', function() {
      utils.stripQuotes({html: function(){return '\'lodash\'';}}).should.equal('lodash');
    });

    it('"lodash\'', function() {
      utils.stripQuotes({html: function(){return '"lodash\'';}}).should.equal('lodash');
    });

  });
});
