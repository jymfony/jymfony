/**
 * @internal
 *
 * @memberOf Jymfony.Component.Console.Helper
 */
export default class TableRows {
    /**
     * Constructor.
     *
     * @param {GeneratorFunction} generator
     */
    __construct(generator) {
        /**
         * @type {GeneratorFunction}
         *
         * @private
         */
        this._generator = generator;
    }

    [Symbol.iterator]() {
        return this._generator();
    }
}
