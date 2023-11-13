/**
 * A BoundFunction represents a function bound to a specific object.
 * Call to "apply" and "call" methods of the closure will result in
 * a call of the bound function.
 *
 * To access the BoundFunction object use the innerObject property
 * of the returned value
 */
class BoundFunction {
    /**
     * @type {Object}
     */

    #thisArg;

    /**
     * @type {Function|GeneratorFunction}
     */
    #func;

    /**
     * Create a BoundFunction of thisArg.func and return
     * a callable anonymous function.
     *
     * @param {Object} thisArg
     * @param {Function|GeneratorFunction|string|symbol} func
     *
     * @returns {Function|GeneratorFunction}
     */
    constructor(thisArg, func) {
        if (! isFunction(func)) {
            throw new LogicException('Trying to bind a non-function object');
        }

        if (isFunction(thisArg.__invoke) && undefined !== thisArg[Symbol.for('jymfony.namespace.class')]) {
            thisArg = thisArg[Symbol.for('jymfony.namespace.class')];
        }

        this.#thisArg = thisArg;
        this.#func = func;

        return new Proxy(func, {
            get: (target, name, receiver) => {
                switch (name) {
                    case 'innerObject':
                        return this;

                    case 'equals':
                        return this.equals.bind(this);

                    default:
                        return Reflect.get(target, name, receiver);
                }
            },
            has(target, p) {
                switch (p) {
                    case 'innerObject':
                    case 'equals':
                        return true;

                    default:
                        return Reflect.has(target, p);
                }
            },
            apply: (target, thisArg1, argArray) => {
                return this.#func.apply(this.#thisArg, argArray);
            },
        });
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

        return this.#thisArg === value.#thisArg &&
                this.#func === value.#func;
    }

    /**
     * Get the bound object
     *
     * @returns {Object}
     */
    getObject() {
        return this.#thisArg;
    }

    /**
     * Get the bound function
     *
     * @returns {Function}
     */
    getFunction() {
        return this.#func;
    }
}

globalThis.BoundFunction = BoundFunction;
