'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Get [Key, Value] pairs for an object
 *
 * @param {Object} object
 *
 * @returns {Generator}
 */
const entries = function * objentries(object) {
    if (isArray(object)) {
        for (const k of object.keys()) {
            yield [ k, object[k] ];
        }

        return;
    }

    if (object instanceof Map) {
        return object.entries();
    }

    if (! isObject(object)) {
        throw new InvalidArgumentException('Argument 1 is not an object');
    }

    if (Object.entries) {
        yield * Object.entries(object);
        return;
    }

    for (const key in object) {
        if (! object.hasOwnProperty(key)) {
            continue;
        }

        yield [ key, object[key] ];
    }
};

global.__jymfony.getEntries = entries;
