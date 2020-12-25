const ScalarComparator = Jymfony.Component.Testing.Comparator.ScalarComparator;

/**
 * Compares numerical values for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class NumericComparator extends ScalarComparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        // All numerical values, but not if one of them is a double
        // Or both of them are strings
        return isNumeric(expected) && isNumeric(actual) &&
               !(isNumber(expected) || isNumber(actual)) &&
               !(isString(expected) && isString(actual));
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { // eslint-disable-line no-unused-vars
        if (isInfinite(actual) && isInfinite(expected)) {
            return;
        }

        if ((! isInfinite(actual) !== ! isInfinite(expected)) ||
            (isNaN(actual) || isNaN(expected)) ||
            Math.abs(actual - expected) > delta) {
            throw new ComparisonFailure(
                expected,
                actual,
                '',
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
