global.isArray = Array.isArray;
const toString = Object.prototype.toString;

require('./Is/functions');

if (! isFunction(global.isObject)) {
    global.isObject = function (arg) {
        return !! arg && 'object' === typeof arg;
    };
}

for(const name of [ 'Arguments', 'Boolean', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet' ]) {
    if (isFunction(global['is' + name])) {
        continue;
    }

    global['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

const primitives = [ Number, String, Boolean ];
global.isScalar = function isScalar(value) {
    if (undefined === value || null === value) {
        return false;
    }

    const proto = Object.getPrototypeOf(value);
    for (const type of primitives) {
        if (proto === type.prototype) {
            return true;
        }
    }

    return false;
};

global.isObjectLiteral = function isObjectLiteral(value) {
    if (null === value || undefined === value) {
        return false;
    }

    return Object.getPrototypeOf(value) === Object.getPrototypeOf({});
};

global.isPromise = function isPromise(value) {
    return isFunction(value.then);
};

global.isStream = function isStream(stream) {
    return 'object' === typeof stream && isFunction(stream.pipe);
};
