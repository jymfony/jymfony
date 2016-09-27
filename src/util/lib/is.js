global.isArray = Array.isArray;

let toString = Object.prototype.toString;
for(let name of ['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
    global['is' + name] = function(obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

