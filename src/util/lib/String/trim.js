// Replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {string} str
 * @param {string} charList
 *
 * @returns {string}
 */
__jymfony.rtrim = (str, charList = undefined) => {
    if (undefined === charList) {
        charList = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charList = __jymfony.regex_quote(charList);
    }

    const re = new RegExp(`[${charList}]+$`, 'g');
    return str.replace(re, '');
};

/**
 * @param {string} str
 * @param {string} charList
 *
 * @returns {string}
 */
__jymfony.ltrim = (str, charList = undefined) => {
    if (undefined === charList) {
        charList = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charList = __jymfony.regex_quote(charList);
    }

    const re = new RegExp(`^[${charList}]+`, 'g');
    return str.replace(re, '');
};

/**
 * @param {string} str
 * @param {string} charList
 *
 * @returns {string}
 */
__jymfony.trim = (str, charList = undefined) => {
    return __jymfony.rtrim(__jymfony.ltrim(str, charList), charList);
};
