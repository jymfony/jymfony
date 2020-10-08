/**
 * Value holder for cache.
 *
 * @memberOf Jymfony.Contracts.Cache
 */
export default class ValueHolder {
    /**
     * Constructor.
     *
     * @param {*} value
     */
    __construct(value) {
        /**
         * @type {*}
         */
        this.value = value;
    }
}
