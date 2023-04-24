const AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;

/**
 * Exception for expectations which failed their check.
 *
 * The exception contains the error message and optionally a
 * ComparisonFailure which is used to generate diff output of the failed expectations.
 *
 * @memberOf Jymfony.Component.Testing.Framework.Exception
 */
export default class ExpectationFailedException extends AssertionFailedException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Testing.Comparator.ComparisonFailure} [comparisonFailure = null]
     * @param {Error} [previous = null]
     */
    __construct(message, comparisonFailure = null, previous = null) {
        /**
         * @type {Jymfony.Component.Testing.Comparator.ComparisonFailure}
         *
         * @private
         */
        this._comparisonFailure = comparisonFailure;

        this._actual = comparisonFailure ? comparisonFailure.actualAsString : undefined;
        this._expected = comparisonFailure ? comparisonFailure.expectedAsString : undefined;

        super.__construct(message, 0, previous);
    }

    /**
     * Returns the comparison failed actual value.
     * It is currently requested by mocha.
     */
    get actual() {
        return this._actual;
    }

    /**
     * Sets the comparison failed actual value.
     * It is currently requested by mocha.
     */
    set actual(actual) {
        this._actual = actual;
    }

    /**
     * Returns the comparison failed expected value.
     * It is currently requested by mocha.
     */
    get expected() {
        return this._expected;
    }

    /**
     * Sets the comparison failed expected value.
     * It is currently requested by mocha.
     */
    set expected(expected) {
        this._expected = expected;
    }

    get comparisonFailure() {
        return this._comparisonFailure;
    }
}
