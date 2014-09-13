var registries = require('github-linker-registries');

before(function() {
  registries.npm = {
    lodash: 'https://github.com/lodash/lodash'
  };
});
