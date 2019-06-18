'use strict';

global.__jymfony = global.__jymfony || {};

/**
 * Get key, value pairs from any object.
 *
 * @param {Object.<K, V>|Map<K, V>|V[]} object
 *
 * @returns {IterableIterator.<[K, V]>}
 * @template K, V
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
    } else {
        for (const key of [ ...Object.keys(object), ...Object.getOwnPropertySymbols(object) ]) {
            yield [ key, object[key] ];
        }
    }
};
