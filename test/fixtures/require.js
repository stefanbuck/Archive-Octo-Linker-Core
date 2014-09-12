
require('path'); // => http://nodejs.org/api/path.html
require('lodash'); // => https://github.com/lodash/lodash
require('unknown-package-name'); // => tbd

require('./file.js'); //=> /stefanbuck/github-linker-core/blob/master/test/fixtures/file.js
require('./folder/file.js'); //=> /stefanbuck/github-linker-core/blob/master/test/fixtures/folder/file.js
require('./file-or-folder');  // => /stefanbuck/github-linker-core/blob/master/test/fixtures/file-or-folder

require('../file.js'); //=> /stefanbuck/github-linker-core/blob/master/test/file.js
require('../folder/file.js'); //=> /stefanbuck/github-linker-core/blob/master/test/folder/file.js
require('../file-or-folder'); // => /stefanbuck/github-linker-core/blob/master/test/file-or-folder

require('../../file.js'); //=> /stefanbuck/github-linker-core/blob/master/file.js
require('../../folder/file.js'); //=> /stefanbuck/github-linker-core/blob/master/folder/file.js
require('../../file-or-folder'); // => /stefanbuck/github-linker-core/blob/master/file-or-folder

require('./'); //=> /stefanbuck/github-linker-core/blob/master/test/fixtures
require('..'); //=> /stefanbuck/github-linker-core/blob/master/test
require('../'); //=> /stefanbuck/github-linker-core/blob/master/test
require('../..'); //=> /stefanbuck/github-linker-core/blob/master
require('../../'); //=> /stefanbuck/github-linker-core/blob/master

require('.'); // => tbd
require('...'); // => tbd
require('/'); // => tbd
