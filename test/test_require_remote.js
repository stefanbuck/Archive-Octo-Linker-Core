'use strict';

var githubLinkerCore = require('../');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('require.js', function() {

  describe('remote', function() {
    var $, result;
    var url = 'https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/require.js';

    before(function(done) {
      $ = result = null;

      env(url, function(err, window) {
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
      // result.should.have.length(23);

      result.length.should.equal(23);
    });

    it('check link replacement', function() {
      $('a.github-linker').length.should.equal(20);
    });

    it('http://nodejs.org/api/path.html', function() {
      var item = _.findWhere(result, {
        name: 'path'
      });

      item.link.should.equal('http://nodejs.org/api/path.html');

      item.el.attr('href').should.equal('http://nodejs.org/api/path.html');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('https://github.com/lodash/lodash', function() {
      var item = _.findWhere(result, {
        name: 'lodash'
      });

      item.link.should.equal('https://github.com/lodash/lodash');

      item.el.attr('href').should.equal('https://github.com/lodash/lodash');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('unknown-package-name', function() {
      var item = _.findWhere(result, {
        name: 'unknown-package-name'
      });

      item.link.should.equal('https://www.npmjs.org/package/unknown-package-name');

      item.el.data('href').should.equal('https://www.npmjs.org/package/unknown-package-name');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('matthewmueller/uid', function() {
      var item = _.findWhere(result, {
        name: 'matthewmueller/uid'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/matthewmueller/uid');

      item.el.data('href').should.equal('https://github.com/matthewmueller/uid');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('component/tip@master', function() {
      var item = _.findWhere(result, {
        name: 'component/tip@master'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/component/tip/tree/master');

      item.el.data('href').should.equal('https://github.com/component/tip/tree/master');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('yields/shortcuts@0.0.1:/index.js', function() {
      var item = _.findWhere(result, {
        name: 'yields/shortcuts@0.0.1:/index.js'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/yields/shortcuts/blob/0.0.1/index.js');

      item.el.data('href').should.equal('https://github.com/yields/shortcuts/blob/0.0.1/index.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('./file.js', function() {
      var item = _.findWhere(result, {
        name: './file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('./folder/file.js', function() {
      var item = _.findWhere(result, {
        name: './folder/file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/folder/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/folder/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('./file-or-folder', function() {
      var item = _.findWhere(result, {
        name: './file-or-folder'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/file-or-folder');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/file-or-folder');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../file.js', function() {
      var item = _.findWhere(result, {
        name: '../file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../folder/file.js', function() {
      var item = _.findWhere(result, {
        name: '../folder/file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/folder/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/folder/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../file-or-folder', function() {
      var item = _.findWhere(result, {
        name: '../file-or-folder'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/file-or-folder');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/file-or-folder');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../../file.js', function() {
      var item = _.findWhere(result, {
        name: '../../file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../../folder/file.js', function() {
      var item = _.findWhere(result, {
        name: '../../folder/file.js'
      });

      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/folder/file.js');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/folder/file.js');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../../file-or-folder', function() {
      var item = _.findWhere(result, {
        name: '../../file-or-folder'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/file-or-folder');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/file-or-folder');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('./', function() {
      var item = _.findWhere(result, {
        name: './'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('..', function() {
      var item = _.findWhere(result, {
        name: '..'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../', function() {
      var item = _.findWhere(result, {
        name: '../'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master/test');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../..', function() {
      var item = _.findWhere(result, {
        name: '../..'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('../../', function() {
      var item = _.findWhere(result, {
        name: '../../'
      });

      item.resolveLink.should.be.ok;
      item.link.should.equal('https://github.com/stefanbuck/github-linker-core/blob/master');

      item.el.data('href').should.equal('https://github.com/stefanbuck/github-linker-core/blob/master');
      item.el.hasClass('tooltipped').should.be.false;
    });

    it('.', function() {
      var item = _.findWhere(result, {
        name: '.'
      });
      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });

    it('...', function() {
      var item = _.findWhere(result, {
        name: '...'
      });

      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });

    it('/', function() {
      var item = _.findWhere(result, {
        name: '/'
      });

      (item.link === '').should.equal(true);
      item.el.hasClass('tooltipped').should.be.true;
    });

    it('resolve url', function() {
      var item = _.findWhere(result, {
        name: '../../file-or-folder'
      });

      item.el.trigger('click');
    });

  });
});
