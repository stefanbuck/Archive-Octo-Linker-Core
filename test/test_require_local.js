'use strict';

var githubLinkerCore = require('../');
var fs = require('fs');
var path = require('path');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('require.js', function() {

  describe('local', function() {
    var $, result;
    var url = 'https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/require.js';
    var file = path.resolve(__dirname, 'fixtures/require.js.html');

    before(function(done) {
      $ = result = null;
      var html = fs.readFileSync(file, 'utf-8');

      env(html, function(err, window) {
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
      // result.should.have.length(20);

      result.length.should.equal(20);
    });

    it('http://nodejs.org/api/path.html', function() {
      var item = _.findWhere(result, {
        name: 'path'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('http://nodejs.org/api/path.html');
    });

    it('https://github.com/lodash/lodash', function() {
      var item = _.findWhere(result, {
        name: 'lodash'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('https://github.com/lodash/lodash');
    });

    it.skip('unknown-package-name', function() {
      var item = _.findWhere(result, {
        name: 'unknown-package-name'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('tbd');
    });

    it('./file.js', function() {
      var item = _.findWhere(result, {
        name: './file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/test/fixtures/file.js');
    });

    it('./folder/file.js', function() {
      var item = _.findWhere(result, {
        name: './folder/file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/test/fixtures/folder/file.js');
    });

    it('./file-or-folder', function() {
      var item = _.findWhere(result, {
        name: './file-or-folder'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/test/fixtures/file-or-folder');
    });

    it('../file.js', function() {
      var item = _.findWhere(result, {
        name: '../file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/test/file.js');
    });

    it('../folder/file.js', function() {
      var item = _.findWhere(result, {
        name: '../folder/file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/test/folder/file.js');
    });

    it('../file-or-folder', function() {
      var item = _.findWhere(result, {
        name: '../file-or-folder'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/test/file-or-folder');
    });

    it('../../file.js', function() {
      var item = _.findWhere(result, {
        name: '../../file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/file.js');
    });

    it('../../folder/file.js', function() {
      var item = _.findWhere(result, {
        name: '../../folder/file.js'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('/stefanbuck/github-linker-core/blob/master/folder/file.js');
    });

    it('../../file-or-folder', function() {
      var item = _.findWhere(result, {
        name: '../../file-or-folder'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/file-or-folder');
    });

    it('./', function() {
      var item = _.findWhere(result, {
        name: './'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/test/fixtures');
    });

    it('..', function() {
      var item = _.findWhere(result, {
        name: '..'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/test');
    });

    it('../', function() {
      var item = _.findWhere(result, {
        name: '../'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master/test');
    });

    it('../..', function() {
      var item = _.findWhere(result, {
        name: '../..'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master');
    });

    it('../../', function() {
      var item = _.findWhere(result, {
        name: '../../'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('resolve:/stefanbuck/github-linker-core/blob/master');
    });

    it.skip('.', function() {
      var item = _.findWhere(result, {
        name: '.'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('tbd');
    });

    it.skip('...', function() {
      var item = _.findWhere(result, {
        name: '...'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('tbd');
    });

    it.skip('/', function() {
      var item = _.findWhere(result, {
        name: '/'
      });

      (item.link === null).should.equal(false);
      item.link.should.equal('tbd');
    });

  });
});
