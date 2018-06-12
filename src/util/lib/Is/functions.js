global.isGenerator = function isGenerator(value) {
    return value && 'function' === typeof value.next && 'function' === typeof value.throw;
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

        return 'AsyncFunction' === (constructor.name || constructor.displayName);
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
    if (undefined !== global.BoundFunction && obj instanceof BoundFunction) {
        return true;
    }

    if (isGeneratorFunction(obj)) {
        return true;
    }

    if (isAsyncFunction(obj)) {
        return true;
    }

    return '[object Function]' === toString.call(obj);
};
