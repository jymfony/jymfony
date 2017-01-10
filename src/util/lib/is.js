global.isArray = Array.isArray;
let toString = Object.prototype.toString;

require('./Is/functions');

if (! isFunction(global.isObject)) {
    global.isObject = function (arg) {
        return !! arg && typeof arg === 'object';
    }
}

for(let name of ['Arguments', 'Boolean', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
    if (isFunction(global['is' + name])) {
        continue;
    }

    global['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

const primitives = [ Number, String, Boolean ];
global.isScalar = function (value) {
    if (undefined === value || null === value) {
        return false;
    }

    let proto = Object.getPrototypeOf(value);
    for (let type of primitives) {
        if (proto === type.prototype) {
            return true;
        }
    }

    return false;
};

global.isObjectLiteral = function (value) {
    if (null === value || undefined === value) {
        return false;
    }

    return Object.getPrototypeOf(value) === Object.getPrototypeOf({});
};

global.isPromise = function (value) {
    return isFunction(value.then);
};

global.isStream = module.exports = function (stream) {
    return typeof stream === 'object' && isFunction(stream.pipe);
};
