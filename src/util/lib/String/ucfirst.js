'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Uppercase first character
 *
 * @param {string} string
 *
 * @returns {string}
 */
__jymfony.ucfirst = (string) => {
    return string.charAt(0).toUpperCase() + string.substring(1);
};
