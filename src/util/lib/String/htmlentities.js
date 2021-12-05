'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

const get_html_translation_table = require('./get_html_translation_table');
const memo = {};

const get_regex = (quoteStyle, doubleEncode) => {
    const cacheKey = quoteStyle + '_' + (doubleEncode ? '1' : '0');
    if (undefined !== memo[cacheKey]) {
        return memo[cacheKey];
    }

    const hashMap = get_html_translation_table('HTML_ENTITIES', quoteStyle);
    if (0 === __jymfony.keys(hashMap).length) {
        return false;
    }

    const regex = new RegExp('&(?:#\\d+|#x[\\da-f]+|[a-zA-Z][\\da-z]*);|[' +
        Object.keys(hashMap)
            .join('')
            // Replace regexp special chars
            .replace(/([()[\]{}\-.*+?^$|/\\])/g, '\\$1') + ']',
    'g');

    return memo[cacheKey] = [ regex, (ent) => {
        if (1 < ent.length) {
            return doubleEncode ? hashMap['&'] + ent.substr(1) : ent;
        }

        return hashMap[ent];
    } ];
};

/**
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * @param {string} string
 * @param {string} quoteStyle
 * @param {boolean} doubleEncode
 */
__jymfony.htmlentities = (string, quoteStyle = 'ENT_COMPAT', doubleEncode = true) => {
    //  Discuss at: http://locutus.io/php/htmlentities/
    // Original by: Kevin van Zonneveld (http://kvz.io)
    //  Revised by: Kevin van Zonneveld (http://kvz.io)
    //  Revised by: Kevin van Zonneveld (http://kvz.io)
    // Improved by: nobbler
    // Improved by: Jack
    // Improved by: Rafał Kukawski (http://blog.kukawski.pl)
    // Improved by: Dj (http://locutus.io/php/htmlentities:425#comment_134018)
    // Bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // Bugfixed by: Brett Zamir (http://brett-zamir.me)
    //    Input by: Ratheous
    //      Note 1: function is compatible with PHP 5.2 and older
    //   Example 1: htmlentities('Kevin & van Zonneveld')
    //   Returns 1: 'Kevin &amp; van Zonneveld'
    //   Example 2: htmlentities("foo'bar","ENT_QUOTES")
    //   Returns 2: 'foo&#039;bar'

    return String(string).replace(...get_regex(quoteStyle, doubleEncode));
};
