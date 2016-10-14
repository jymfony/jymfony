let isCallableArray = function (arg) {
    if (! isArray(arg) || arg.length !== 2) {
        return false;
    }

    let target = arg[0];
    return isString(arg[1]) && isFunction(target[arg[1]]);
};

/** global: LogicException */
let getCallableFromArray = function (arg) {
    if (! isCallableArray(arg)) {
        throw new LogicException(arg + ' is not a callable array');
    }

    let target = arg[0];
    let func = target[arg[1]];

    return func.bind(arg[0]);
};

global.isCallableArray = isCallableArray;
global.getCallableFromArray = getCallableFromArray;
