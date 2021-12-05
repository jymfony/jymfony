'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Adapted from locutus.io
 * Originally released under MIT license
 *
 * @param {string} arg
 */
__jymfony.escapeshellarg = (arg) => {
    //  Discuss at: http://locutus.io/php/escapeshellarg/
    // Original by: Felix Geisendoerfer (http://www.debuggable.com/felix)
    // Improved by: Brett Zamir (http://brett-zamir.me)
    //   Example 1: escapeshellarg("kevin's birthday")
    //   Returns 1: "'kevin\\'s birthday'"

    return '\'' + arg.replace(/[^\\]'/g, m => m.slice(0, 1) + '\\\'') + '\'';
};
