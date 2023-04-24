const ArrayComparator = Jymfony.Component.Testing.Comparator.ArrayComparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares objects for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class ObjectComparator extends ArrayComparator {
    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        return isObject(expected) && isObject(actual);
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false, processed = new Set()) {
        if (ReflectionClass.getClassName(actual) !== ReflectionClass.getClassName(expected)) {
            throw new ComparisonFailure(
                expected,
                actual,
                this.export(expected),
                this.export(actual),
                false,
                __jymfony.sprintf(
                    '%s is not instance of expected class "%s".',
                    this.export(actual),
                    ReflectionClass.getClassName(expected)
                )
            );
        }

        // Don't compare twice to allow for cyclic dependencies
        for (const [ a, b ] of processed) {
            if ((a === actual && b === expected) || (a === expected && b === actual)) {
                return;
            }
        }

        processed.add([ actual, expected ]);

        // Don't compare objects if they are identical
        // This helps to avoid the error "maximum function nesting level reached"
        // CAUTION: this conditional clause is not tested
        if (actual !== expected) {
            try {
                super.assertEquals(
                    this._toArray(expected),
                    this._toArray(actual),
                    delta,
                    ignoreCase,
                    processed
                );
            } catch (e) {
                if (e instanceof ComparisonFailure) {
                    throw new ComparisonFailure(
                        expected,
                        actual,
                        ReflectionClass.getClassName(expected) + e.expectedAsString.substring(6),
                        ReflectionClass.getClassName(actual) + e.actualAsString.substring(6),
                        false,
                        'Failed asserting that two objects are equal.'
                    );
                }

                throw e;
            }
        }
    }

    /**
     * Converts an object to an array containing all of its private, protected
     * and public properties.
     *
     * @param {object} object
     *
     * @returns {*}
     */
    _toArray(object) {
        return this.toObjectLiteral(object);
    }
}
