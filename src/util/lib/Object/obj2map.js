'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {Object} obj
 *
 * @returns {Map}
 */
const obj2map = function (obj) {
    if (Object.getPrototypeOf(obj) !== Object.prototype) {
        return obj;
    }

    const result = new Map();
    for (const [ key, value ] of __jymfony.getEntries(obj)) {
        result.set(key, obj2map(value));
    }

    return result;
};

global.__jymfony.obj2map = obj2map;
