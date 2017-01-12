// Replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.rtrim = function rtrim(str, charList) {
    if (undefined === charList) {
        charList = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charList.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    let re = new RegExp(`[${charList}]+$`, 'g');
    return str.replace(re, '');
};

global.__jymfony.ltrim = function ltrim(str, charList) {
    if (undefined === charList) {
        charList = ' \\x09\\x0A\\x0D\\x00\\x0B';
    } else {
        charList.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }

    let re = new RegExp(`^[${charList}]+`, 'g');
    return str.replace(re, '');
};

global.__jymfony.trim = function trim(str, charList) {
    return __jymfony.rtrim(__jymfony.ltrim(str, charList), charList);
};
