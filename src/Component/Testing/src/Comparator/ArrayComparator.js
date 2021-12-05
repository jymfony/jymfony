const Comparator = Jymfony.Component.Testing.Comparator.Comparator;
const ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

/**
 * Compares arrays for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 */
export default class ArrayComparator extends Comparator {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Testing.Comparator.ComparatorFactory} comparatorFactory
     */
    __construct(comparatorFactory) {
        super.__construct();

        /**
         * @type {Jymfony.Component.Testing.Comparator.ComparatorFactory}
         *
         * @private
         */
        this._comparatorFactory = comparatorFactory;
    }

    /**
     * @inheritdoc
     */
    accepts(expected, actual) {
        return (isArray(expected) && isArray(actual)) ||
            (isObjectLiteral(expected) && isObjectLiteral(actual));
    }

    /**
     * @inheritdoc
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false, processed = new Set()) {
        const remaining = { ...actual };
        let actualAsString = isObjectLiteral(actual) ? 'Object (\n' : 'Array (\n';
        let expectedAsString = isObjectLiteral(expected) ? 'Object (\n' : 'Array (\n';
        let equal = true;

        const actualKeys = Object.keys(actual);
        for (const [ key, value ] of __jymfony.getEntries(expected)) {
            delete remaining[key];

            if (! actualKeys.includes(String(key))) {
                expectedAsString += __jymfony.sprintf(
                    '    %s => %s\n',
                    this.export(key),
                    this.shortenedExport(value)
                );

                equal = false;
                continue;
            }

            try {
                const comparator = this._comparatorFactory.getComparatorFor(value, actual[key]);
                comparator.assertEquals(value, actual[key], delta, ignoreCase, processed);

                expectedAsString += __jymfony.sprintf(
                    '    %s => %s\n',
                    this.export(key),
                    this.shortenedExport(value)
                );

                actualAsString += __jymfony.sprintf(
                    '    %s => %s\n',
                    this.export(key),
                    this.shortenedExport(actual[key])
                );
            } catch (e) {
                if (! (e instanceof ComparisonFailure)) {
                    throw e;
                }

                expectedAsString += __jymfony.sprintf(
                    '    %s => %s\n',
                    this.export(key),
                    e.expectedAsString ? this._indent(e.expectedAsString) : this.shortenedExport(e.expected)
                );

                actualAsString += __jymfony.sprintf(
                    '    %s => %s\n',
                    this.export(key),
                    e.actualAsString ? this._indent(e.actualAsString) : this.shortenedExport(e.actual)
                );

                equal = false;
            }
        }

        for (const [ key, value ] of __jymfony.getEntries(remaining)) {
            actualAsString += __jymfony.sprintf(
                '    %s => %s\n',
                this.export(key),
                this.shortenedExport(value)
            );

            equal = false;
        }

        expectedAsString += ')';
        actualAsString += ')';

        if (! equal) {
            throw new ComparisonFailure(
                expected,
                actual,
                expectedAsString,
                actualAsString,
                false,
                'Failed asserting that two arrays are equal.'
            );
        }
    }

    _indent(lines) {
        return __jymfony.trim(lines.replace(/\n/g, '\n    '));
    }
}
