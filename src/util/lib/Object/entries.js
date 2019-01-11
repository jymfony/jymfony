'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * @template <K, V>
 * Get key, value pairs from any object.
 *
 * @param {Object.<K, V>|Map<K, V>|V[]} object
 *
 * @returns {IterableIterator.<[K, V]>}
 */
__jymfony.getEntries = function * getEntries(object) {
    if (isArray(object)) {
        for (const k of object.keys()) {
            yield [ k, object[k] ];
        }
    } else if (object instanceof Map) {
        yield * object.entries();
    } else if (! isObject(object)) {
        throw new InvalidArgumentException('Argument 1 is not an object');
    } else if (Object.entries) {
        yield * Object.entries(object);
    } else {
        for (const key in object) {
            if (!object.hasOwnProperty(key)) {
                continue;
            }

            yield [ key, object[key] ];
        }
    }
};
