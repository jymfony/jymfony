'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Uppercase first words characters
 *
 * @param {string} string
 */
global.__jymfony.ucwords = function (string) {
    return string.toString()
        .replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, $1 => $1.toUpperCase());
};
