'use strict';

global.__jymfony = global.__jymfony || {};

/*
 * Adapted from locutus.io
 */
global.__jymfony.escapeshellarg = function escapeshellarg (arg) {
    //  discuss at: http://locutus.io/php/escapeshellarg/
    // original by: Felix Geisendoerfer (http://www.debuggable.com/felix)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //   example 1: escapeshellarg("kevin's birthday")
    //   returns 1: "'kevin\\'s birthday'"

    return "'" + arg.replace(/[^\\]'/g, m => m.slice(0, 1) + '\\\'') + "'";
};
