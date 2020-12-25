const Comparator = Jymfony.Component.Testing.Comparator.Comparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares values for type equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class TypeComparator extends Comparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) { // eslint-disable-line no-unused-vars
        return true;
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { // eslint-disable-line no-unused-vars
        if (typeof expected !== typeof actual) {
            throw new ComparisonFailure(
                expected,
                actual,
                '', // We don't need a diff
                '',
                false,
                __jymfony.sprintf(
                    '%s does not match expected type "%s".',
                    this.export(actual),
                    typeof expected
                )
            );
        }
    }
}
