global.isArray = Array.isArray;

global.isFunction = function (obj) {
    if (obj instanceof BoundFunction) {
        return true;
    }

    return toString.call(obj) === '[object Function]';
};

let toString = Object.prototype.toString;
for(let name of ['Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
    global['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

