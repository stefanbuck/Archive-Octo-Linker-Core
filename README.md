# GitHub-Linker Core
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-url]][daviddm-image] [![Coverage Status][coveralls-image]][coveralls-url]

This browserify friendly npm module contains everything what the GitHub-Linker needs to work. Currently the core is only used by the GitHub-Linker [Chrome Extension](https://github.com/github-linker/github-linker/chrome-extension). It would be possible to create other GitHub-Linker extensions for another browser as well. But this is currently out of scope. By the way, contributes are welcome. Get in touch with me!

## Features

> GitHub.com is constantly under development and therefore, sometimes some features doesn't work. Feel free to open an issue so I can solve it as soon as possible. Thank you.


### Manifest files



Replace dependencies listed in `package.json` `bower.json` or `composer.json` with the related GitHub repository. In this case, you will redirected to https://github.com/sindresorhus/chalk

![List prompt](https://dl.dropboxusercontent.com/s/m7bicvnyf4kf37i/manifest_package.png)



It's also possible to click these attributes `main`, `bin` and `directories` in a manifest file to jump to the target file. In this case, you will redirected to https://github.com/yeoman/environment/blob/master/lib/environment.js

![List prompt](https://dl.dropboxusercontent.com/s/ph8ap6mkft47l10/manifest_entry.png)



### Require

> This feature is not supported on any GitHub page, because it's unfortunately not possible everywhere.


This is one of the key features in the GitHub-Linker. It allows you to jump directly to the GitHub repository page of the named package. In this case, you will redirected to https://github.com/sindresorhus/chalk

![List prompt](https://dl.dropboxusercontent.com/s/a50aypabfs814ma/require_package.png)



It can handle locale require statements as well.

![List prompt](https://dl.dropboxusercontent.com/s/sqpxbrg2dh8ngq5/require_relative.png)



Also relative require statements.

![List prompt](https://dl.dropboxusercontent.com/s/tbhbeo98ejsvekt/require_relative1.png)



## Usage


```javascript
var core = require('github-linker-core');
var $ = require('jquery');

var options = {
  showUpdateNotification: false
};

core(window, options, function(err, result) {
  if (err) {
    return console.error(err);
  }
  console.log(result);
});

```



## License

Copyright (c) 2015 Stefan Buck. Licensed under the MIT license.



[npm-url]: https://npmjs.org/package/github-linker-core
[npm-image]: https://badge.fury.io/js/github-linker-core.svg
[travis-url]: https://travis-ci.org/github-linker/core
[travis-image]: https://travis-ci.org/github-linker/core.svg?branch=master
[daviddm-url]: https://david-dm.org/github-linker/core.svg?theme=shields.io
[daviddm-image]: https://david-dm.org/github-linker/core
[coveralls-url]: https://coveralls.io/r/github-linker/core
[coveralls-image]: https://coveralls.io/repos/github-linker/core/badge.png
