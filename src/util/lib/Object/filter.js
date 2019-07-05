'use strict';

/**
 * @param {Object} obj
 * @param {Function} predicate
 *
 * @returns {Object}
 */
Object.filter = (obj, predicate) =>
    __jymfony.keys(obj)
        .filter( key => predicate(obj[key]) )
        .reduce( (res, key) => (res[key] = obj[key], res), {} );
