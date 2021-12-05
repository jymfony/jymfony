'use strict';

globalThis.__jymfony = globalThis.__jymfony || {};

/**
 * Gets a debug representation of the value (class name of type).
 *
 * @param {*} value
 *
 * @returns {string}
 */
__jymfony.get_debug_type = (value) => {
    switch (true) {
        case null === value: return 'null';
        case undefined === value: return 'undefined';
        case isBoolean(value): return 'boolean';
        case isString(value): return 'string';
        case isArray(value): return 'array';
        case isNumber(value): return 'number';
        case isObjectLiteral(value): return 'object';
        case ! isObject(value): return typeof value;
    }

    if ('undefined' !== typeof ReflectionClass) {
        const reflectionClass = new ReflectionClass(value);
        const className = reflectionClass.name || reflectionClass.getConstructor().name || 'object';
        if (className.startsWith('_anonymous_xΞ')) {
            return 'class@anonymous';
        }

        return className;
    }

    return value.constructor.name;
};
