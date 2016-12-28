// replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.rtrim = function rtrim (str, charlist) {
    if (undefined === charlist) {
        charlist = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charlist.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    let re = new RegExp('[' + charlist + ']+$', 'g');
    return str.replace(re, '');
};

global.__jymfony.ltrim = function ltrim (str, charlist) {
    if (undefined === charlist) {
        charlist = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charlist.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    let re = new RegExp('^[' + charlist + ']+', 'g');
    return str.replace(re, '');
};

global.__jymfony.trim = function trim(str, charlist) {
    return __jymfony.rtrim(__jymfony.ltrim(str, charlist), charlist);
};
