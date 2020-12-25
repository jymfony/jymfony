const ExpectationFailedException = Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException;
const ExporterTrait = Jymfony.Component.Testing.ExporterTrait;

/**
 * Abstract base class for constraints which can be applied to any value.
 *
 * @memberOf Jymfony.Component.Testing.Constraints
 * @abstract
 */
export default class Constraint extends implementationOf(ExporterTrait) {
    /**
     * Evaluates the constraint for parameter other
     *
     * If Throw is set to true (the default), an exception is thrown
     * in case of a failure. null is returned otherwise.
     *
     * If Throw is false, the result of the evaluation is returned as
     * a boolean value instead: true in case of success, false in case of a
     * failure.
     *
     * @param {*} other
     * @param {string} [description = '']
     * @param {boolean} [Throw = true]
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     */
    evaluate(other, description = '', Throw = true) {
        const success = this.matches(other);
        if (! Throw) {
            return success;
        }

        if (! success) {
            this.fail(other, description);
        }
    }

    /**
     * Counts the number of constraint elements.
     */
    get length() {
        return 1;
    }

    /**
     * Evaluates the constraint for parameter other. Returns true if the
     * constraint is met, false otherwise.
     *
     * This method can be overridden to implement the evaluation algorithm.
     *
     * @param {*} other value or object to evaluate
     *
     * @returns {boolean}
     *
     * @protected
     */
    matches(other) { // eslint-disable-line no-unused-vars
        return false;
    }

    /**
     * Throws an exception for the given compared value and test description
     *
     * @param {*} other Evaluated value or object
     * @param {string} description Additional information about the test
     * @param {Jymfony.Component.Testing.Comparator.ComparisonFailure} [comparisonFailure = null]
     *
     * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
     *
     * @protected
     */
    fail(other, description, comparisonFailure = null) {
        let failureDescription = __jymfony.sprintf(
            'Failed asserting that %s.',
            this._failureDescription(other)
        );

        const additionalFailureDescription = this._additionalFailureDescription(other);
        if (additionalFailureDescription) {
            failureDescription += '\n' + additionalFailureDescription;
        }

        if (! description) {
            failureDescription = description + '\n' + failureDescription;
        }

        throw new ExpectationFailedException(failureDescription, comparisonFailure);
    }

    /**
     * Return additional failure description where needed
     *
     * The function can be overridden to provide additional failure
     * information like a diff
     *
     * @param {*} other evaluated value or object
     *
     * @protected
     */
    _additionalFailureDescription(other) { // eslint-disable-line no-unused-vars
        return '';
    }

    /**
     * Returns the description of the failure
     *
     * The beginning of failure messages is "Failed asserting that" in most
     * cases. This method should return the second part of that sentence.
     *
     * To provide additional failure information additionalFailureDescription
     * can be used.
     *
     * @param {*} other evaluated value or object
     *
     * @protected
     */
    _failureDescription(other) {
        return this.export(other) + ' ' + this.toString();
    }
}
