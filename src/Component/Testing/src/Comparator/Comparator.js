const ExporterTrait = Jymfony.Component.Testing.ExporterTrait;

/**
 * Abstract base class for comparators which compare values for equality.
 *
 * @memberOf Jymfony.Component.Testing.Comparator
 * @abstract
 */
export default class Comparator extends implementationOf(ExporterTrait) {
    /**
     * Returns whether the comparator can compare two values.
     *
     * @param {*} expected The first value to compare
     * @param {*} actual   The second value to compare
     *
     * @returns {boolean}
     *
     * @abstract
     */
    accepts(expected, actual) { } // eslint-disable-line no-unused-vars

    /**
     * Asserts that two values are equal.
     *
     * @param {*} expected First value to compare
     * @param {*} actual Second value to compare
     * @param {number} [delta = 0.0] Allowed numerical distance between two values to consider them equal
     * @param {boolean} [ignoreCase = false] Case is ignored when set to true
     *
     * @throws {Jymfony.Component.Testing.Comparator.ComparisonFailure}
     *
     * @abstract
     */
    assertEquals(expected, actual, delta = 0.0, ignoreCase = false) { } // eslint-disable-line no-unused-vars
}
