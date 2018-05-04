'use strict';

/**
 * @param {Object} obj
 * @param {Function} predicate
 *
 * @returns {Object}
 */
Object.filter = (obj, predicate) =>
    Object.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );
