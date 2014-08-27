'use strict';

var githubLinkerCore = require('../');
var fs = require('fs');
var path = require('path');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('githubLinkerCore', function() {

  var $, result;

  beforeEach(function(done) {
    var file = path.resolve(__dirname, 'fixtures/package.html');
    var html = fs.readFileSync(file, 'utf-8');

    $ = result = null;

    env(html, function(err, window) {
      if (err) {
        return done(err);
      }
      $ = require('jquery')(window);

      var url = 'https://github.com/stefanbuck/playground-repo/blob/master/package.json';
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
    var pkgNames = ['lodash', 'request', 'modernizr', 'backbone', 'jquery', 'unknown-package-name', 'chai', 'gulp', 'yo', 'should'];
    _.each(result, function(item, index) {
      item.name.should.equal( pkgNames[index] );
    });
  });

  it('url Modernizr/Modernizr', function() {
    var item = _.findWhere(result, {
      name: 'modernizr'
    });

    (item.url === null).should.equal(false);
    item.url.should.equal('https://github.com/Modernizr/Modernizr');
  });

  it('url jashkenas/backbone#master', function() {
    var item = _.findWhere(result, {
      name: 'backbone'
    });

    (item.url === null).should.equal(false);
    item.url.should.equal('https://github.com/jashkenas/backbone/tree/master');
  });

  it('url jquery/jquery#1.x-master', function() {
    var item = _.findWhere(result, {
      name: 'jquery'
    });

    (item.url === null).should.equal(false);
    item.url.should.equal('https://github.com/jquery/jquery/tree/1.x-master');
  });

});
