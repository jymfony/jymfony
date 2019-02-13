'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @param {Object} obj
 *
 * @returns {Map}
 */
const obj2map = (obj) => {
    if (Object.getPrototypeOf(obj) !== Object.prototype) {
        return obj;
    }

    const result = new Map();
    for (const [ key, value ] of __jymfony.getEntries(obj)) {
        result.set(key, obj2map(value));
    }

    return result;
};

__jymfony.obj2map = obj2map;

/**
 * @param {Map} map
 *
 * @returns {Object}
 */
const map2obj = (map) => {
    if (! (map instanceof Map)) {
        return map;
    }

    return Array.from(map.entries())
        .reduce( (res, entry) => (res[entry[0]] = entry[1], res), {} );
};

__jymfony.map2obj = map2obj;
