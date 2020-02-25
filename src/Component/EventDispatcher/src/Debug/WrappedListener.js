/**
 * @memberOf Jymfony.Component.EventDispatcher.Debug
 */
export default class WrappedListener {
    /**
     * Constructor
     *
     * @param {Function} listener
     * @param {string} eventName
     * @param {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface} dispatcher
     */
    __construct(listener, eventName, dispatcher) {
        /**
         * @type {Object}
         *
         * @private
         */
        this._listener = listener;

        /**
         * @type {Jymfony.Contracts.EventDispatcher.EventDispatcherInterface}
         *
         * @private
         */
        this._dispatcher = dispatcher;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._called = false;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._stoppedPropagation = false;

        /**
         * @type {string}
         *
         * @private
         */
        this._name = 'Function';

        /**
         * @type {string}
         *
         * @private
         */
        this._pretty = 'Function';

        if (isCallableArray(listener)) {
            this._name = (new ReflectionClass(listener[0])).name;
            this._pretty = this._name + '.' + listener[1];
        }

        return new Proxy(listener, {
            get: (target, key) => {
                if (Reflect.has(this, key)) {
                    return Reflect.get(this, key);
                }

                return Reflect.get(target, key);
            },
            has: (target, key) => {
                return Reflect.has(this, key) || Reflect.get(target, key);
            },
            apply: (target, thisArg, argArray) => {
                const [ event, eventName ] = argArray;
                this._called = true;

                const retVal = Reflect.apply(target, thisArg, [ event, eventName, this._dispatcher ]);
                if (isPromise(retVal)) {
                    retVal.then(() => {
                        if (event.isPropagationStopped()) {
                            this._stoppedPropagation = true;
                        }
                    });
                } else {
                    if (event.isPropagationStopped()) {
                        this._stoppedPropagation = true;
                    }
                }

                return retVal;
            },
        });
    }

    /**
     * @returns {Object}
     */
    get wrappedListener() {
        return this._listener;
    }

    /**
     * @returns {boolean}
     */
    get wasCalled() {
        return this._called;
    }

    /**
     * @returns {boolean}
     */
    get stoppedPropagation() {
        return this._stoppedPropagation;
    }

    /**
     * @returns {string}
     */
    get pretty() {
        return this._pretty;
    }
}
