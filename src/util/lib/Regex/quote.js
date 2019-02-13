'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {string} str
 *
 * @returns {string}
 */
__jymfony.regex_quote = (str) => {
    return str.toString()
        .replace(/[.\\+*?\[\^\]$(){}=!<>|:-]/g, '\\$&');
};
