/*
 * github-linker-core
 * https://github.com/stefanbuck/github-linker
 *
 * Copyright (c) 2014 Stefan Buck
 * Licensed under the MIT license.
 */

'use strict';

var $ = null;

var stripQuotes = function(jqElement) {
    return jqElement.html().replace(/"/g, '');
};

var getPackageNodes = function() {

    var $root, $row, $name, $version, name, version, targetURL;
    var types = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'];
    var result = [];

    types.forEach(function(selector) {
        $root = $('.nt:contains(\'' + selector + '\')');

        if (!$root || $root.length === 0) {
            return;
        }

        $row = $root.closest('tr').next();

        while ($row) {
            $name = $row.find('.nt');
            $version = $row.find('.s2');

            if (!$name.length || !$version.length) {
                return;
            }

            name = stripQuotes($name);
            version = stripQuotes($version);

            if (version.split('/').length === 2) {
                version = version.replace('#', '/tree/');
                targetURL = 'https://github.com/' + version;
            }

            result.push({
                el: $name,
                version: version,
                name: name,
                url: targetURL
            });

            $row = $row.next();
        }
    });

    return result;
};

module.exports = function(_$, _type, cb) {
    $ = _$;

    var result = getPackageNodes();

    cb(null, result);
};
