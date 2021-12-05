'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Uppercase first words characters
 *
 * @param {string} string
 * @param {string} delimiter
 *
 * @returns {string}
 */
__jymfony.ucwords = (string, delimiter = '\\s') => {
    return string.toString()
        .replace(new RegExp('^([a-z\\u00E0-\\u00FC])|' + delimiter + '([a-z\\u00E0-\\u00FC])', 'g'), $1 => $1.toUpperCase())
    ;
};
