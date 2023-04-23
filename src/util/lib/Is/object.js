if (! isFunction(globalThis.isObject)) {
    globalThis.isObject = function (arg) {
        return !! arg && 'object' === typeof arg;
    };
}
