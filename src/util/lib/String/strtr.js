'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.strtr = function strtr(string, replacePairs) {
    let str = string.toString(), re;

    for (let [ key, value ] of __jymfony.getEntries(replacePairs)) {
        key = key.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
        re = new RegExp(key, 'g');
        str = str.replace(re, value);
    }

    return str;
};
