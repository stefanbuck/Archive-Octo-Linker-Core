'use strict';

require('should');
var _ = require('lodash');
var helper = require('./helper');
var sinon = require('sinon');

describe('live-resolver.js', function() {
  this.timeout(4000);
  var openStub;

  before(function(done) {
    helper('require.js', function(err, _result) {
      if (err) {
        return done(err);
      }
      this.result = _result.require;
      openStub = sinon.stub();
      global.open = openStub;
      done();
    }.bind(this));
  });

  afterEach(function() {
    openStub.reset();
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
    openStub.args[0][0].should.equal('https://nodejs.org/api/path.html');
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
    openStub.args[0][0].should.equal('https://www.npmjs.org/package/lodash');
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
    openStub.args[0][0].should.equal('https://github.com/foo/lodash');
  });

});
