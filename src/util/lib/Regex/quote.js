'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * @param {string} str
 *
 * @returns {string}
 */
__jymfony.regex_quote = (str) => {
    return str.toString()
        .replace(/[.\\+*?\[\^\]$(){}=!<>|:-]/g, '\\$&');
};
