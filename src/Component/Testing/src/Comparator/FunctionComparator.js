const Comparator = Jymfony.Component.Testing.Comparator.Comparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares function values.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class FunctionComparator extends Comparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        return isFunction(expected) && isFunction(actual);
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { // eslint-disable-line no-unused-vars
        if (! this._equal(expected, actual)) {
            throw new ComparisonFailure(
                expected,
                actual,
                '', // We don't need a diff
                '',
                false,
                'The functions are not equal'
            );
        }
    }

    _equal(expected, actual) {
        if (expected.innerObject instanceof BoundFunction) {
            return expected.innerObject.equals(actual);
        }

        if (actual.innerObject instanceof BoundFunction) {
            return actual.innerObject.equals(expected);
        }

        return expected.name === actual.name &&
            expected.length === actual.length &&
            expected.toString() === actual.toString();
    }
}
