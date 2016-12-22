global.isArray = Array.isArray;
let toString = Object.prototype.toString;

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

for(let name of ['Arguments', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet']) {
    if (isFunction(global['is' + name])) {
        continue;
    }

    global['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

const primitives = [ Number, String, Boolean ];
global.isScalar = function (value) {
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

global.isGenerator = function (value) {
    return isFunction(value.next) && isFunction(value.throw);
};
global.isGeneratorFunction = function (value) {
    if (isGenerator(value)) {
        return false;
    }

    let constructor = value.constructor;

    if (! constructor) {
        return false;
    }

    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
        return true;
    }

    return isGenerator(constructor.prototype);
};

global.isPromise = function (value) {
    return isFunction(value.then);
};
