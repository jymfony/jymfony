'use strict';

function getImplementation() {
    if ('undefined' !== typeof global) {
        return global;
    } else if ('undefined' !== typeof self) {
        return self;
    } else if ('undefined' !== typeof window) {
        return window;
    }

    return Function('return this')();

}

function getPolyfill() {
    if ('object' !== typeof global || !global || global.Math !== Math || global.Array !== Array) {
        return getImplementation();
    }

    return global;
}

const polyfill = getPolyfill();
const descriptor = Object.getOwnPropertyDescriptor(polyfill, 'globalThis');
if (!descriptor || (descriptor.configurable && (descriptor.enumerable || descriptor.writable || globalThis !== polyfill))) { // eslint-disable-line max-len
    Object.defineProperty(polyfill, 'globalThis', {
        configurable: true,
        enumerable: false,
        value: polyfill,
        writable: false,
    });
}
