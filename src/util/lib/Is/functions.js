global.isGenerator = function isGenerator(value) {
    return isObject(value) &&
        Reflect.has(value, 'next') && Reflect.has(value, 'throw') &&
        'function' === typeof value.next && 'function' === typeof value.throw;
};

/**
 * @param {*} value
 *
 * @returns {boolean}
 */
global.isGeneratorFunction = function isGeneratorFunction(value) {
    if (! value) {
        return false;
    }

    if (isGenerator(value)) {
        return false;
    }

    if ('[object AsyncGeneratorFunction]' === Object.prototype.toString.call(value)) {
        return true;
    }

    if (isGeneratorFunction(value.__invoke)) {
        return true;
    }

    const constructor = value.constructor;
    if (! constructor) {
        return false;
    }

    if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) {
        return true;
    }

    return isGenerator(constructor.prototype);
};

if (__jymfony.Platform.hasAsyncFunctionSupport()) {
    /**
     * @param {*} value
     *
     * @returns {boolean}
     */
    global.isAsyncFunction = function isAsyncFunction(value) {
        if (!value) {
            return false;
        }

        const constructor = value.constructor;
        if (!constructor) {
            return false;
        }

        if ('AsyncFunction' === (constructor.name || constructor.displayName)) {
            return true;
        }

        return '[object AsyncFunction]' === Object.prototype.toString.call(value);
    };
} else {
    global.isAsyncFunction = function isAsyncFunction() {
        return false;
    };
}

/**
 * @param {*} obj
 *
 * @returns {boolean}
 */
global.isFunction = function isFunction(obj) {
    if (! obj) {
        return false;
    }

    if (undefined !== global.BoundFunction && obj instanceof BoundFunction) {
        return true;
    }

    if (undefined !== global.BoundFunction && obj.hasOwnProperty('innerObject') && obj.innerObject instanceof BoundFunction) {
        return true;
    }

    if (isGeneratorFunction(obj)) {
        return true;
    }

    if (isAsyncFunction(obj)) {
        return true;
    }

    if (isFunction(obj.__invoke)) {
        return true;
    }

    return '[object Function]' === Object.prototype.toString.call(obj);
};
