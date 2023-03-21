globalThis.isArray = Array.isArray;
globalThis.isBuffer = !! globalThis.Buffer ? Buffer.isBuffer : () => false;
const toString = Object.prototype.toString;

require('./Is/functions');

if (! isFunction(globalThis.isObject)) {
    globalThis.isObject = function (arg) {
        return !! arg && 'object' === typeof arg;
    };
}

for (const name of [ 'Arguments', 'BigInt', 'Boolean', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet' ]) {
    if (isFunction(globalThis['is' + name])) {
        continue;
    }

    globalThis['is' + name] = function (obj) {
        return toString.call(obj) === '[object ' + name + ']';
    };
}

const primitives = [ Number, String, Boolean ];

globalThis.isNaN = Number.isNaN;
globalThis.isInfinite = function isInfinite(value) {
    return value === Infinity || value === -Infinity;
};

globalThis.isNumeric = function isNumeric(value) {
    if (isNumber(value)) {
        return true;
    }

    return !! String(value).match(/^(\d+|\.\d+|\d+.\d+)$/);
};

/**
 * @param {*} value
 *
 * @returns {boolean}
 */
globalThis.isNumeric = function isNumeric(value) {
    if (! isScalar(value)) {
        return false;
    }

    if (isNumber(value)) {
        return true;
    }

    return !! String(value).match(/^[+-]?((\d+|\.\d+|\d+\.\d+)(e[+-]?\d+)?|0x[0-9a-f_]+)$/i);
};

/**
 * @param {*} value
 *
 * @returns {boolean}
 */
globalThis.isScalar = function isScalar(value) {
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

const objectPrototype = Object.getPrototypeOf({});

/**
 * @param {*} value
 *
 * @returns {boolean}
 */
globalThis.isObjectLiteral = function isObjectLiteral(value) {
    if (null === value || undefined === value) {
        return false;
    }

    let proto;
    try {
        proto = Object.getPrototypeOf(value);
    } catch (e) {
        return false;
    }

    return null === proto || proto === objectPrototype;
};

/**
 * @param {*} value
 *
 * @returns {boolean}
 */
globalThis.isPromise = function isPromise(value) {
    return 'object' === typeof value && isFunction(value.then);
};

/**
 * @param {*} stream
 *
 * @returns {boolean}
 */
globalThis.isStream = function isStream(stream) {
    return 'object' === typeof stream && isFunction(stream.pipe);
};
