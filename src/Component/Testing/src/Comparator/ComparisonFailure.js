/**
 * Thrown when an assertion for string equality failed.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class ComparisonFailure extends RuntimeException {
    /**
     * Initialises with the expected value and the actual value.
     *
     * @param {*} expected Expected value retrieved
     * @param {*} actual Actual value retrieved
     * @param {string} expectedAsString
     * @param {string} actualAsString
     * @param {boolean} [identical = false]
     * @param {string} [message = ''] A string which is prefixed on all returned lines in the difference output
     */
    __construct(expected, actual, expectedAsString, actualAsString, identical = false, message = '') {
        /**
         * Expected value of the retrieval which does not match actual.
         *
         * @type {*}
         * @protected
         */
        this._expected = expected;

        /**
         * Actually retrieved value which does not match expected.
         *
         * @type {*}
         * @protected
         */
        this._actual = actual;

        /**
         * The string representation of the expected value
         *
         * @var string
         */
        this._expectedAsString = expectedAsString;

        /**
         * The string representation of the actual value
         *
         * @type {string}
         * @protected
         */
        this._actualAsString = actualAsString;

        /**
         * @type {boolean}
         * @protected
         */
        this._identical = identical;

        /**
         * Optional message which is placed in front of the first line
         * returned by toString().
         *
         * @type {string}
         * @protected
         */
        this._message = message;
    }

    get actual() {
        return this._actual;
    }

    get expected() {
        return this._expected;
    }

    /**
     * @returns {string}
     */
    get actualAsString() {
        return this._actualAsString;
    }

    /**
     * @returns {string}
     */
    get expectedAsString() {
        return this._expectedAsString;
    }

    /**
     * @returns {string}
     */
    get diff() {
        if (! this._actualAsString && ! this._expectedAsString) {
            return '';
        }

        // @todo
        const differ = new Differ(new UnifiedDiffOutputBuilder('\n--- Expected\n+++ Actual\n'));

        return differ.diff(this._expectedAsString, this._actualAsString);
    }

    /**
     * @returns {string}
     */
    toString() {
        return this._message + this.diff;
    }
}
