global.isArray = Array.isArray;

global.isFunction = function (obj) {
    if (obj instanceof BoundFunction) {
        return true;
    }

    return toString.call(obj) === '[object Function]';
};

if (! isFunction(global.isObject)) {
    global.isObject = function (arg) {
        return !! arg && typeof arg === 'object';
    }
}

let toString = Object.prototype.toString;
for(let name of ['Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
    if (isFunction(global['is' + name])) {
        continue;
    }

    global['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

