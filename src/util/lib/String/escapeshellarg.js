'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * @param {string} arg
 */
global.__jymfony.escapeshellarg = function escapeshellarg(arg) {
    //  Discuss at: http://locutus.io/php/escapeshellarg/
    // Original by: Felix Geisendoerfer (http://www.debuggable.com/felix)
    // Improved by: Brett Zamir (http://brett-zamir.me)
    //   Example 1: escapeshellarg("kevin's birthday")
    //   Returns 1: "'kevin\\'s birthday'"

    return '\'' + arg.replace(/[^\\]'/g, m => m.slice(0, 1) + '\\\'') + '\'';
};
