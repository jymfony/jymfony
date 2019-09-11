/**
 * @memberOf Jymfony.Component.DependencyInjection.Argument
 */
export default class RewindableGenerator {
    /**
     * Constructor.
     *
     * @param {GeneratorFunction} generator
     * @param {int|Function} count
     */
    __construct(generator, count) {
        /**
         * @type {GeneratorFunction}
         *
         * @private
         */
        this._generator = generator;

        /**
         * @type {int|Function}
         *
         * @private
         */
        this._count = count;
    }

    /**
     * Iterate through values.
     *
     * @returns {IterableIterator<*>}
     */
    * [Symbol.iterator]() {
        yield * this._generator();
    }

    /**
     * Gets the length of the generator.
     *
     * @returns {int}
     */
    get length() {
        if (isFunction(this._count)) {
            this._count = this._count();
        }

        return this._count;
    }
}
