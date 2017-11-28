'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * @param {String} haystack
 * @param {String} needle
 * @param {int} offset
 * @param {int} length
 *
 * @returns {int|Boolean}
 */
global.__jymfony.substr_count = (haystack, needle, offset = 0, length = 0) => {
    //  discuss at: http://locutus.io/php/substr_count/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // improved by: Thomas
    //  example 1: substr_count('Kevin van Zonneveld', 'e')
    //  returns 1: 3
    //  example 2: substr_count('Kevin van Zonneveld', 'K', 1)
    //  returns 2: 0
    //  example 3: substr_count('Kevin van Zonneveld', 'Z', 0, 10)
    //  returns 3: false
    let cnt = 0;
    haystack += '';
    needle += '';

    if (needle.length === 0) {
        return false;
    }

    offset--;
    while ((offset = haystack.indexOf(needle, offset + 1)) !== -1) {
        if (length > 0 && (offset + needle.length) > length) {
            return false;
        }

        cnt++;
    }

    return cnt;
};
