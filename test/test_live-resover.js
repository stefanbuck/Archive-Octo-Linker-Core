'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');

describe('live-resolver.js', function() {
  this.timeout(4000);

  before(function(done) {
    helper('require.js', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.require;
      global.location = {};
      done();
    }.bind(this));
  });

  it('https://nodejs.org/api/path.html', function() {
    global.$.ajax = function () {
      var d = global.$.Deferred();
      d.resolve();
      return d.promise();
    };
    var item = _.findWhere(this.result, {
      name: 'path'
    });

    $(item.el).click();
    global.location.href.should.equal('https://nodejs.org/api/path.html');
  });

  it('https://www.npmjs.org/package/lodash', function() {
    global.$.ajax = function () {
      var d = global.$.Deferred();
      d.reject({});
      return d.promise();
    };
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.el.click();
    global.location.href.should.equal('https://www.npmjs.org/package/lodash');
  });

  it('https://github.com/foo/lodash', function() {
    global.$.ajax = function () {
      var d = global.$.Deferred();
      d.resolve({
        url: 'https://github.com/foo/lodash'
      });
      return d.promise();
    };
    var item = _.findWhere(this.result, {
      name: 'lodash'
    });

    item.el.click();
    global.location.href.should.equal('https://github.com/foo/lodash');
  });

});
