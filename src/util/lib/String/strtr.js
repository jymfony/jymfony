'use strict';

require('../Regex/quote');

global.__jymfony = global.__jymfony || {};

/**
 * @param {string} string
 * @param {string|Object} replacePairs
 * @param {string} to
 *
 * @returns {string}
 */
__jymfony.strtr = (string, replacePairs, to) => {
    let keys;

    if (isString(replacePairs) && isString(to)) {
        if (replacePairs.length !== to.length) {
            throw new Exception('Replace strings must have the same length');
        }

        to = to.split('');
        keys = replacePairs.split('');
        replacePairs = {};
        for (const [ i, key ] of __jymfony.getEntries(keys)) {
            replacePairs[key] = to[i];
        }
    } else {
        keys = Object.keys(replacePairs);
    }

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
