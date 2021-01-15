const Comparator = Jymfony.Component.Testing.Comparator.Comparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares Buffer values for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class BufferComparator extends Comparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        return isBuffer(expected) && isBuffer(actual);
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { // eslint-disable-line no-unused-vars
        if (0 !== Buffer.compare(expected, actual)) {
            throw new ComparisonFailure(
                expected,
                actual,
                this.export(expected),
                this.export(actual),
                false,
                'Failed asserting that two buffers are equal.'
            );
        }
    }
}
