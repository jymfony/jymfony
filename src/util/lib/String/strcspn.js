'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * @param {string} str
 * @param {string} mask
 *
 * @returns {int}
 *
 * @internal
 */
const _strcspn = (str, mask) => {
    let lgth = 0;
    for (let i = 0; i < str.length; i++) {
        if (-1 !== mask.indexOf(str.charAt(i))) {
            break;
        }

        ++lgth;
    }

    return lgth;
};

/**
 * The strcspn() function returns the number of characters (including whitespaces)
 * found in a string before any part of the specified characters are found.
 *
 * @param {string} str
 * @param {string} mask
 * @param {int} [start = 0]
 * @param {undefined|int} [length]
 *
 * @returns {int}
 */
__jymfony.strcspn = (str, mask, start = 0, length = undefined) => {
    if (0 !== start) {
        str = str.substr(start);
    }

    if (length !== undefined) {
        if (0 > length) {
            length = str.length + length;
        }

        str = str.substr(0, length);
    }

    return _strcspn(str, mask);
};
