'use strict';

global.__jymfony = global.__jymfony || {};

global.__jymfony.clone = function clone(object) {
    if (! isObject(object)) {
        throw new InvalidArgumentException('Cannot clone a non-object');
    }

    const surrogateCtor = function () { };
    surrogateCtor.prototype = object.constructor.prototype;

    const target = new surrogateCtor();
    for (let k of Object.keys(object)) {
        target[k] = object[k];
    }

    return target;
};

global.__jymfony.deepClone = function deepClone(object) {
    if (! object ) {
        return object;
    }

    if (isScalar(object)) {
        return object;
    }

    let result;

    if (isArray(object)) {
        result = [];
        object.forEach((child, index) => {
            result[index] = deepClone(child);
        });
    } else if (isObject(object)) {
        if (isObjectLiteral(object)) {
            // Object literal ({ ... })
            result = {};
            for (let i of Object.keys(object)) {
                result[i] = deepClone(object[i]);
            }
        } else if (object instanceof Date) {
            result = new Date(object);
        } else {
            result = object;
        }
    }

    return result;
};
