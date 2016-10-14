class BoundFunction {
    constructor(thisArg, func) {
        if (! isFunction(func)) {
            /** global: LogicException */
            throw new LogicException('Trying to bind a non-function object');
        }

        this._thisArg = thisArg;
        this._func = func;

        let ret = () => {
            return this.apply(undefined, arguments);
        };

        ret.apply = this.apply.bind(this);
        ret.call = this.call.bind(this);
        ret.innerObject = this;

        return ret;
    }

    /**
     * Call the function. It works exacly the same of
     * Function.apply, except that it ignores the first argument since
     * "this" is already defined
     *
     * @param {Object} thisArg Ignored
     * @param {Array} argArray
     * @return {*}
     */
    apply(thisArg, argArray) {
        return this._func.apply(this._thisArg, argArray);
    }

    /**
     * Call the function with arguments.
     * NOTE: The only difference with {@see apply} is that call() accepts
     * an argument list, instead of a single array of arguments
     *
     * @param {Object} thisArg
     * @param {...*} [args]
     * @returns {*}
     */
    call(thisArg, args) {
        args = arguments.slice(1);
        return this.apply(undefined, args);
    }

    /**
     * Is this BoundFunction equals to another?
     *
     * @param {*} value
     * @returns {Boolean}
     */
    equals(value) {
        if (!(value instanceof BoundFunction)) {
            return false;
        }

        return this._thisArg === value._thisArg &&
                this._func === value._func;
    }
}

global.BoundFunction = BoundFunction;
