globalThis.isArray = Array.isArray;
globalThis.isBuffer = !! globalThis.Buffer ? Buffer.isBuffer : () => false;
const toString = Object.prototype.toString;

require('./Is/functions');
require('./Is/object');

for (const name of [ 'Arguments', 'BigInt', 'Boolean', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet' ]) {
    if (isFunction(globalThis['is' + name])) {
        continue;
    }

    if (! isFunction(globalThis['is' + name])) {
        globalThis['is' + name] = function (obj) {
            return toString.call(obj) === '[object ' + name + ']';
        };
    }
}

const primitives = [ Number, String, Boolean ];

if (! isFunction(globalThis.isNaN)) {
    globalThis.isNaN = Number.isNaN;
}

if (! isFunction(globalThis.isInfinite)) {
    globalThis.isInfinite = function isInfinite(value) {
        return value === Infinity || value === -Infinity;
    };
}

if (! isFunction(globalThis.isNumeric)) {
    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    globalThis.isNumeric = function isNumeric(value) {
        if (!isScalar(value)) {
            return false;
        }

        if (isNumber(value)) {
            return true;
        }

        return !!String(value).match(/^[+-]?((\d+|\.\d+|\d+\.\d+)(e[+-]?\d+)?|0x[0-9a-f_]+)$/i);
    };
}

if (! isFunction(globalThis.isScalar)) {
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
}

const objectPrototype = Object.getPrototypeOf({});

if (! isFunction(globalThis.isObjectLiteral)) {
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
}

if (! isFunction(globalThis.isPromise)) {
    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    globalThis.isPromise = function isPromise(value) {
        return 'object' === typeof value && isFunction(value.then);
    };
}

if (! isFunction(globalThis.isStream)) {
    /**
     * @param {*} stream
     *
     * @returns {boolean}
     */
    globalThis.isStream = function isStream(stream) {
        return 'object' === typeof stream && isFunction(stream.pipe);
    };
}
