'use strict';

global.__jymfony = global.__jymfony || {};

let obj2map = function (obj) {
    if (Object.getPrototypeOf(obj) !== Object.prototype) {
        return obj;
    }

    let result = new Map;
    for (let [ key, value ] of __jymfony.getEntries(obj)) {
        result.set(key, obj2map(value));
    }

    return result;
};

global.__jymfony.obj2map = obj2map;
