'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * @param {Object} object
 *
 * @returns {Object}
 */
__jymfony.clone = (object) => {
    if (! isObject(object)) {
        throw new InvalidArgumentException('Cannot clone a non-object');
    }

    const surrogateCtor = function () { };
    surrogateCtor.prototype = object.constructor.prototype;

    const target = new surrogateCtor();
    for (const k of __jymfony.keys(object)) {
        target[k] = object[k];
    }

    if (isFunction(target.__clone)) {
        target.__clone();
    }

    return target;
};

/**
 * @param {Object} object
 * @returns {Object}
 */
__jymfony.deepClone = function deepClone(object) {
    if (! object) {
        return object;
    }

    if (isScalar(object)) {
        return object;
    }

    let result = object;

    if (isArray(object)) {
        result = [];
        object.forEach((child, index) => {
            result[index] = deepClone(child);
        });
    } else if (isObject(object)) {
        if (isObjectLiteral(object)) {
            // Object literal ({ ... })
            result = {};
            for (const i of __jymfony.keys(object)) {
                result[i] = deepClone(object[i]);
            }
        } else if (object instanceof Date) {
            result = new Date(object);
        }
    }

    return result;
};
