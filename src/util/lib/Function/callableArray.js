/**
 * Check if arg is an array describing a callable
 *
 * @param arg
 * @returns {Boolean}
 */
let isCallableArray = function (arg) {
    if (! isArray(arg) || arg.length !== 2) {
        return false;
    }

    let target = arg[0];
    return isString(arg[1]) && isFunction(target[arg[1]]);
};

/**
 * Generate a BoundFunction object from a callable
 * array. The function can be called via apply or
 * call methods.
 *
 * @param {Array} arg
 * @returns {BoundFunction}
 */
let getCallableFromArray = function (arg) {
    if (! isCallableArray(arg)) {
        throw new LogicException(arg + ' is not a callable array');
    }

    let target = arg[0];
    let func = target[arg[1]];

    return new BoundFunction(target, func);
};

global.isCallableArray = isCallableArray;
global.getCallableFromArray = getCallableFromArray;
