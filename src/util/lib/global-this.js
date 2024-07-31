'use strict';

function check(it) {
    return it && it.Math === Math && it;
}

function getImplementation() {
    return check('object' === typeof globalThis && globalThis) ||
        check('object' === typeof global && global) ||
        check('object' === typeof window && window) ||
        check('object' === typeof self && self) ||
        // eslint-disable-next-line brace-style
        (function () { return this; }()) || Function('return this')();
}

const polyfill = getImplementation();
const descriptor = Object.getOwnPropertyDescriptor(polyfill, 'globalThis');
if (!descriptor || globalThis !== polyfill) {
    Object.defineProperty(polyfill, 'globalThis', {
        configurable: true,
        enumerable: false,
        value: polyfill,
        writable: false,
    });
}
