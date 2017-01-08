'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Uppercase first character
 *
 * @param {string} string
 */
global.__jymfony.ucfirst = function ucfirst(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
};
