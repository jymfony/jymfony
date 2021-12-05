const Comparator = Jymfony.Component.Testing.Comparator.Comparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares scalar or NULL values for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class ScalarComparator extends Comparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        return (
            (!isScalar(expected) !== (null !== expected)) && (! isScalar(actual) !== (null !== actual))
        ) || isString(expected) || isString(actual);
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { // eslint-disable-line no-unused-vars
        let expectedToCompare = expected;
        let actualToCompare = actual;

        // Always compare as strings to avoid strange behaviour
        if (isString(expected) || isString(actual)) {
            expectedToCompare = String(expectedToCompare);
            actualToCompare = String(actualToCompare);

            if (ignoreCase) {
                expectedToCompare = expectedToCompare.toLowerCase();
                actualToCompare = actualToCompare.toLowerCase();
            }
        }

        if (expectedToCompare !== actualToCompare && isString(expected) && isString(actual)) {
            throw new ComparisonFailure(
                expected,
                actual,
                this.export(expected),
                this.export(actual),
                false,
                'Failed asserting that two strings are equal.'
            );
        }

        if (expectedToCompare != actualToCompare) {
            throw new ComparisonFailure(
                expected,
                actual,
                '', // No diff is required
                '',
                false,
                __jymfony.sprintf(
                    'Failed asserting that %s matches expected %s.',
                    this.export(actual),
                    this.export(expected)
                )
            );
        }
    }
}
