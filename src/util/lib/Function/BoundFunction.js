/**
 * A BoundFunction represents a function bound to a specific object.
 * Call to "apply" and "call" methods of the closure will result in
 * a call of the bound function.
 *
 * To access the BoundFunction object use the innerObject property
 * of the returned value
 *
 * @type BoundFunction
 */
class BoundFunction {
    /**
     * Create a BoundFunction of thisArg.func and return
     * a callable anonymous function.
     *
     * @param {Object} thisArg
     * @param {Function|GeneratorFunction} func
     *
     * @returns {Function}
     */
    constructor(thisArg, func) {
        if (! isFunction(func)) {
            throw new LogicException('Trying to bind a non-function object');
        }

        this._thisArg = thisArg;
        this._func = func;

        const self = this;
        const ret = function () {
            /* eslint prefer-spread: "off" */
            /* eslint prefer-rest-params: "off" */
            return self.apply(undefined, arguments);
        };

        ret.apply = this.apply.bind(this);
        ret.call = this.call.bind(this);
        ret.equals = this.equals.bind(this);
        ret.innerObject = this;

        return ret;
    }

    /**
     * Call the function. It works exacly the same of
     * Function.apply, except that it ignores the first argument since
     * "this" is already defined
     *
     * @param {Object} thisArg Ignored
     * @param {Arguments|Array} argArray
     *
     * @returns {*}
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
     * @param {...*} args
     *
     * @returns {*}
     */
    call(thisArg, args) {
        args = [].slice.call(arguments, 1);

        /* eslint prefer-spread: "off" */
        return this.apply(undefined, args);
    }

    /**
     * Is this BoundFunction equals to another?
     *
     * @param {*} value
     *
     * @returns {Boolean}
     */
    equals(value) {
        if (isCallableArray(value)) {
            value = getCallableFromArray(value).innerObject;
        }

        if (isFunction(value) && value.innerObject instanceof BoundFunction) {
            value = value.innerObject;
        }

        if (! (value instanceof BoundFunction)) {
            return false;
        }

        return this._thisArg === value._thisArg &&
                this._func === value._func;
    }

    /**
     * Get the bound object
     *
     * @returns {Object}
     */
    getObject() {
        return this._thisArg;
    }
}

global.BoundFunction = BoundFunction;
