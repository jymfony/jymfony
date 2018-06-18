'use strict';

require('../Regex/quote');

global.__jymfony = global.__jymfony || {};

/**
 * @param {string} string
 * @param {Object} replacePairs
 *
 * @returns {string}
 */
global.__jymfony.strtr = function strtr(string, replacePairs) {
    const keys = Object.keys(replacePairs);
    if (0 === keys.length) {
        return string;
    }

    const searchPattern = keys
        .map(__jymfony.regex_quote)
        .join('|');

    return string.toString().replace(new RegExp(searchPattern, 'g'), (match) => {
        return replacePairs[match];
    });
};
