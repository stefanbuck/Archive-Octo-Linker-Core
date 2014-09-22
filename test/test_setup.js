var registries = require('github-linker-cache');

before(function() {
  registries.npm = {
    lodash: 'https://github.com/lodash/lodash'
  };
});
