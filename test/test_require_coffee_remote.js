'use strict';

var githubLinkerCore = require('../');
var assert = require('should');
var _ = require('lodash');
var env = require('jsdom').env;

describe('require.coffee', function() {

  describe('local', function() {
    var $, result;
    var url = 'https://github.com/stefanbuck/github-linker-core/blob/master/test/fixtures/require.coffee';

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
      // result.should.have.length(2);

      result.length.should.equal(2);
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

  });
});
