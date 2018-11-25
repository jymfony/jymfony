/**
 * A Debounce represents a function that delays invoking
 * a function after a given time has elapsed.
 */
class Debounce {
    /**
     * Create a Debounce.
     *
     * @param {Function|GeneratorFunction|AsyncFunction} func
     * @param {int} millis
     *
     * @returns {Function}
     */
    constructor(func, millis) {
        if (! isFunction(func)) {
            throw new LogicException('Trying to bind a non-function object');
        }

        /**
         * @type {int}
         *
         * @private
         */
        this._wait = millis;

        /**
         * @type {Function|GeneratorFunction}
         *
         * @private
         */
        this._func = func;

        /**
         * @type {*}
         *
         * @private
         */
        this._result = undefined;

        /**
         * @type {Object}
         *
         * @private
         */
        this._timerId = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._lastCallTime = undefined;

        /**
         * @type {int}
         *
         * @private
         */
        this._timeSinceLastCall = undefined;

        /**
         * @type {*[]}
         *
         * @private
         */
        this._lastArgs = undefined;

        /**
         * @type {Object}
         *
         * @private
         */
        this._lastThis = undefined;

        const self = this;
        function debounced(...args) {
            const time = Date.now();
            const isInvoking = self._shouldInvoke(time);

            self._lastArgs = args;
            self._lastThis = this;
            self._lastCallTime = time;

            if (isInvoking && self._timerId === undefined) {
                self._timerId = setTimeout(self._timerExpired.bind(self), self._wait);

                return self._result;
            }

            if (self._timerId === undefined) {
                self._timerId = setTimeout(self._timerExpired.bind(self), self._wait);
            }

            return self._result;
        }

        debounced.cancel = this.cancel.bind(this);
        debounced.flush = this.flush.bind(this);
        debounced.pending = this.pending.bind(this);

        return debounced;
    }

    /**
     * Cancels a debounced functions.
     */
    cancel() {
        if (this._timerId !== undefined) {
            clearTimeout(this._timerId);
        }

        this._lastArgs = this._lastCallTime = this._lastThis = this._timerId = undefined;
    }

    /**
     * Immediately invoke the function.
     *
     * @returns {*}
     */
    flush() {
        return this._timerId === undefined ? this._result : this._edge();
    }

    /**
     * Whether a debounce function is pending.
     *
     * @returns {boolean}
     */
    pending() {
        return this._timerId !== undefined;
    }

    /**
     * Either this is the first call, activity has stopped and we're at the
     * trailing edge, the system time has gone backwards and we're treating
     * it as the trailing edge.
     *
     * @param {int} time
     *
     * @returns {boolean}
     *
     * @private
     */
    _shouldInvoke(time) {
        return this._lastCallTime === undefined || time - this._lastCallTime >= this._wait || 0 > this._timeSinceLastCall;
    }

    /**
     * Invokes the function.
     *
     * @returns {*}
     *
     * @private
     */
    _edge() {
        this._timerId = undefined;
        if (this._lastArgs) {
            return this._invokeFunc();
        }

        this._lastArgs = this._lastThis = undefined;

        return this._result;
    }

    /**
     * Timer bound function.
     *
     * @returns {*}
     *
     * @private
     */
    _timerExpired() {
        const time = Date.now();
        if (this._shouldInvoke(time)) {
            return this._edge();
        }

        // Restart the timer.
        this._timerId = setTimeout(this._timerExpired.bind(this), this._wait - (time - this._lastCallTime));
    }

    /**
     * Invokes the function and saves the result.
     *
     * @returns {*}
     *
     * @private
     */
    _invokeFunc() {
        const args = this._lastArgs;
        const thisArg = this._lastThis;

        this._lastArgs = this._lastThis = undefined;

        return this._result = this._func.apply(thisArg, args);
    }
}

global.__jymfony = global.__jymfony || {};

/**
 * Create a Debounce.
 *
 * @param {Function|GeneratorFunction|AsyncFunction} func
 * @param {int} wait
 *
 * @returns {Function}
 */
__jymfony.debounce = (func, wait) => {
    return new Debounce(func, wait);
};
