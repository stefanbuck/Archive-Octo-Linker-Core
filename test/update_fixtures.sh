#!/bin/bash

curl https://github.com/github-linker/core/blob/master/test/fixtures/bower.json > ./test/fixtures/bower.json.html
curl https://github.com/github-linker/core/blob/master/test/fixtures/composer.json > ./test/fixtures/composer.json.html
curl https://github.com/github-linker/core/blob/master/test/fixtures/package.json > ./test/fixtures/package.json.html
curl https://github.com/github-linker/core/blob/master/test/fixtures/require_markdown.md > ./test/fixtures/require_markdown.md.html
curl https://github.com/github-linker/core/blob/master/test/fixtures/require.coffee > ./test/fixtures/require.coffee.html
curl https://github.com/github-linker/core/blob/master/test/fixtures/require.js > ./test/fixtures/require.js.html

curl https://gist.github.com/petereberlecom/a61cb95f9b28270d86a9 > ./test/fixtures/gist.html
curl https://github.com/github-linker/core/issues/10 > ./test/fixtures/require_issues.html
curl https://github.com/github-linker/core/pull/9/files > ./test/fixtures/require_pull.html
