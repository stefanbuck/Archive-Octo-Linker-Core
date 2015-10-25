'use strict';

var utils = require('../lib/util/util');

describe('util', function() {

  // describe('manifest.supported', function() {

  //   it('package.json', function() {
  //     manifest.supported('https://github.com/github-linker/core/blob/master/package.json').should.equal(true);
  //   });

  //   it('bower.json', function() {
  //     manifest.supported('https://github.com/github-linker/core/blob/master/bower.json').should.equal(true);
  //   });

  //   it('composer.json', function() {
  //     manifest.supported('https://github.com/github-linker/core/blob/master/composer.json').should.equal(true);
  //   });

  //   it('unknown.json', function() {
  //     manifest.supported('https://github.com/github-linker/core/blob/master/unknown.json').should.equal(false);
  //   });
  // });

  // describe('require.supported', function() {

  //   it('file.js', function() {
  //     reqr.supported('https://github.com/github-linker/core/blob/master/file.js').should.equal(true);
  //   });

  //   it('file.coffee', function() {
  //     reqr.supported('https://github.com/github-linker/core/blob/master/file.coffee').should.equal(true);
  //   });

  //   it('file.txt', function() {
  //     reqr.supported('https://github.com/github-linker/core/blob/master/file.txt').should.equal(false);
  //   });
  // });

  // describe('advanced urls', function() {

  //   it('with line marker', function() {
  //     manifest.supported('https://github.com/github-linker/core/blob/master/package.json#L1').should.equal(true);
  //     reqr.supported('https://github.com/github-linker/core/blob/master/file.js#L1').should.equal(true);
  //   });
  // });

  describe('stripQuotes', function() {
    it('lodash', function() {
      utils.stripQuotes({text: function(){return 'lodash';}}).should.equal('lodash');
    });

    it('"lodash"', function() {
      utils.stripQuotes({text: function(){return '"lodash"';}}).should.equal('lodash');
    });

    it('\'lodash\'', function() {
      utils.stripQuotes({text: function(){return '\'lodash\'';}}).should.equal('lodash');
    });

    it('"lodash\'', function() {
      utils.stripQuotes({text: function(){return '"lodash\'';}}).should.equal('lodash');
    });

    it(' lodash ', function() {
      utils.stripQuotes({text: function(){return ' lodash ';}}).should.equal('lodash');
    });
  });

  // TODO implement test for
  describe('urlMatch', function() {});
  describe('showLoader', function() {});
});
