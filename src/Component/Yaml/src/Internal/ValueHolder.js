/**
 * Value holder for reference passing.
 *
 * @template T
 * @memberOf Jymfony.Component.Yaml.Internal
 */
export default class ValueHolder {
    /**
     * Constructor.
     *
     * @param {T} value
     * @template T
     */
    __construct(value) {
        this.value = value;
    }

    /**
     * @returns {T}
     * @template T
     */
    get value() {
        return this._value;
    }

    /**
     * @param {T} value
     * @template T
     */
    set value(value) {
        /**
         * @type {T}
         * @template T
         *
         * @private
         */
        this._value = value;
    }

    /**
     * @returns {T}
     * @template T
     */
    get _() {
        return this.value;
    }

    /**
     * @param {T} value
     * @template T
     */
    set _(value) {
        this.value = value;
    }

    /**
     * Returns the value contained in the holder.
     *
     * @returns {T}
     *
     * @template T
     */
    valueOf() {
        const value = this.value;
        if (null === value || undefined === value) {
            return value;
        }

        return value.valueOf();
    }

    /**
     * Converts to primitive.
     *
     * @returns {T}
     *
     * @template T
     */
    [Symbol.toPrimitive]() {
        return this.valueOf();
    }
}
