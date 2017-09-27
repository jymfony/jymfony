'use strict';

global.__jymfony = global.__jymfony || {};
const toString = Object.prototype.toString;

const isPrimitive = function isPrimitive(value) {
    return null === value || undefined === value || 'object' !== typeof value;
};

class MemoizeMap extends WeakMap {
    set(left, right, result) {
        if (isPrimitive(left) || isPrimitive(right)) {
            return this;
        }

        /** @type {WeakMap} */
        let leftMap = super.get(left);
        if (! leftMap) {
            super.set(left, leftMap = new WeakMap());
        }

        leftMap.set(right, result);

        return this;
    }

    get(left, right) {
        if (isPrimitive(left) || isPrimitive(right)) {
            return null;
        }

        let result, map;
        if (map = super.get(left)) {
            result = map.get(right);
        } else if (map = super.get(right)) {
            result = map.get(left);
        }

        return isBoolean(result) ? result : null;
    }
}

const iterableEqual = (left, right, strict, memoizeMap) => {
    if (left.length !== right.length) {
        return false;
    }

    for (let i = 0; i < left.length; ++i) {
        if (false === __jymfony.equal(left[i], right[i], strict, memoizeMap)) {
            return false;
        }
    }

    return true;
};

const enumerableKeys = function enumerableKeys(val) {
    return Array.from((function * () {
        for (const key in val) {
            yield key;
        }
    })());
};

const objectEqual = (left, right, strict, memoizeMap) => {
    const ka = enumerableKeys(left);
    const kb = enumerableKeys(right);

    if (0 === ka.length) {
        return 0 === kb.length;
    }

    ka.sort();
    kb.sort();

    if (! iterableEqual(ka, kb, true, memoizeMap)) {
        return false;
    }

    if (strict && left.prototype !== right.prototype) {
        return false;
    }

    for (const key of ka) {
        if (! __jymfony.equal(left[key], right[key], strict, memoizeMap)) {
            return false;
        }
    }

    return true;
};

const type = function type(obj) {
    const str = toString.call(obj);

    if (str.match(/^\[object .+]$/)) {
        return str.replace(/^\[object /, '').replace(/]$/, '');
    }

    return str;
};

const simpleEqual = function simpleEqual(left, right, strict) {
    if (! strict && left == right) {
        // Simplest case.
        return true;
    }

    if (strict && left === right) {
        // +0 !== -0
        return 0 !== left || 1 / left === 1 / right;
    }

    if (left !== left && right !== right) {
        // Both are NaN
        return true;
    }

    if (isPrimitive(left) || isPrimitive(right)) {
        return false;
    }

    return null;
};

const entriesEqual = function entriesEqual(left, right, strict, memoizeMap) {
    if (left.size !== right.size) {
        return false;
    }

    return 0 === left.size || iterableEqual(Array.from(left).sort(), Array.from(right).sort(), strict, memoizeMap);
};

const deepEqualByType = function deepEqualByType(left, right, leftType, strict, memoizeMap) {
    switch (leftType) {
        case 'String':
        case 'Boolean':
        case 'Date':
        case 'Number':
            return __jymfony.equal(left.valueOf(), right.valueOf(), strict, memoizeMap);

        case 'Promise':
        case 'Symbol':
        case 'function':
        case 'WeakMap':
        case 'WeakSet':
        case 'Error':
            return left === right;

        case 'Arguments':
        case 'Int8Array':
        case 'Uint8Array':
        case 'Uint8ClampedArray':
        case 'Int16Array':
        case 'Uint16Array':
        case 'Int32Array':
        case 'Uint32Array':
        case 'Float32Array':
        case 'Float64Array':
        case 'Array':
            return iterableEqual(left, right, strict, memoizeMap);

        case 'RegExp':
            return left.toString() === right.toString();

        case 'String Iterator':
        case 'Array Iterator':
        case 'Map Iterator':
        case 'Generator':
            return iterableEqual(Array.from(left), Array.from(right), strict, memoizeMap);

        case 'ArrayBuffer':
            return iterableEqual(new Uint8Array(left), new Uint8Array(right), strict, memoizeMap);

        case 'Set':
        case 'Set Iterator':
            return entriesEqual(left, right, strict, memoizeMap);

        case 'Map':
            return entriesEqual(left, right, strict, memoizeMap);

        default:
            return objectEqual(left, right, strict, memoizeMap);
    }
};

const deepEqual = function deepEqual(left, right, strict, memoizeMap) {
    let result = memoizeMap.get(left, right);
    if (result) {
        return result;
    }

    const leftType = type(left);
    if (leftType !== type(right)) {
        memoizeMap.set(left, right, false);
        return false;
    }

    memoizeMap.set(left, right, true);

    result = deepEqualByType(left, right, leftType, strict, memoizeMap);
    memoizeMap.set(left, right, result);

    return result;
};

__jymfony.equal = (left, right, strict = true, memoizeMap = undefined) => {
    let result;
    if (null !== (result = simpleEqual(left, right, strict))) {
        return result;
    }

    return deepEqual(left, right, strict, memoizeMap || new MemoizeMap());
};
