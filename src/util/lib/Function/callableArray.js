'use strict';

/**
 * Check if arg is an array describing a callable
 *
 * @param {*} value
 *
 * @returns {boolean}
 */
global.isCallableArray = function isCallableArray(value) {
    if (! isArray(value) || 2 !== value.length) {
        return false;
    }

    const target = value[0];
    return isString(value[1]) && isFunction(target[value[1]]);
};

/**
 * Generate a BoundFunction object from a callable
 * array. The function can be called via apply or
 * call methods.
 *
 * @param {[string, string]} arg
 *
 * @returns {BoundFunction}
 */
global.getCallableFromArray = function getCallableFromArray(arg) {
    if (! isCallableArray(arg)) {
        throw new LogicException(arg + ' is not a callable array');
    }

    const target = arg[0];
    const func = target[arg[1]];

    return new BoundFunction(target, func);
};
