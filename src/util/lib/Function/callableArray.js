'use strict';

/**
 * Check if arg is an array describing a callable
 *
 * @param {*} arg
 *
 * @returns {Boolean}
 */
const isCallableArray = function isCallableArray(arg) {
    if (! isArray(arg) || 2 !== arg.length) {
        return false;
    }

    const target = arg[0];
    return isString(arg[1]) && isFunction(target[arg[1]]);
};

/**
 * Generate a BoundFunction object from a callable
 * array. The function can be called via apply or
 * call methods.
 *
 * @param {Array} arg
 * @returns {Function|BoundFunction}
 */
const getCallableFromArray = function getCallableFromArray(arg) {
    if (! isCallableArray(arg)) {
        throw new LogicException(arg + ' is not a callable array');
    }

    const target = arg[0];
    const func = target[arg[1]];

    return new BoundFunction(target, func);
};

global.isCallableArray = isCallableArray;
global.getCallableFromArray = getCallableFromArray;
