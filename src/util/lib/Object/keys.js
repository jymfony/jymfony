'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Get object keys.
 *
 * @param {Object.<K, *>|Map<K, *>|*[]} object
 *
 * @returns {K[]}
 * @template K
 */
__jymfony.keys = function keys(object) {
    return [ ...Object.keys(object), ...Object.getOwnPropertySymbols(object) ];
};
