global.isGenerator = function isGenerator(value) {
    return value && typeof value.next === 'function' && typeof value.throw === 'function';
};

global.isGeneratorFunction = function isGeneratorFunction(value) {
    if (! value) {
        return false;
    }

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

if (__jymfony.Platform.hasAsyncFunctionSupport()) {
    global.isAsyncFunction = function isAsyncFunction(value) {
        if (!value) {
            return false;
        }

        let constructor = value.constructor;
        if (!constructor) {
            return false;
        }

        return (constructor.name || constructor.displayName) === 'AsyncFunction';
    };
} else {
    global.isAsyncFunction = function isAsyncFunction() {
        return false;
    }
}

global.isFunction = function isFunction(obj) {
    if (obj instanceof BoundFunction) {
        return true;
    }

    if (isGeneratorFunction(obj)) {
        return true;
    }

    if (isAsyncFunction(obj)) {
        return true;
    }

    return toString.call(obj) === '[object Function]';
};
