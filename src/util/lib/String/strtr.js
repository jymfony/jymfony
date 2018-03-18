'use strict';

require('../Regex/quote');

global.__jymfony = global.__jymfony || {};

global.__jymfony.strtr = function strtr(string, replacePairs) {
    const searchPattern = Object.keys(replacePairs)
        .map(__jymfony.regex_quote)
        .join('|');

    return string.toString().replace(new RegExp(searchPattern, 'g'), (match) => {
        return replacePairs[match];
    });
};
