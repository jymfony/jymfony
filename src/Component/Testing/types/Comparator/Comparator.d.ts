declare namespace Jymfony.Component.Testing.Comparator {
    import ExporterTrait = Jymfony.Component.Testing.ExporterTrait;

    /**
     * Abstract base class for comparators which compare values for equality.
     */
    export abstract class Comparator extends implementationOf(ExporterTrait) {
        /**
         * Returns whether the comparator can compare two values.
         *
         * @param expected The first value to compare
         * @param actual   The second value to compare
         */
        abstract accepts(expected: any, actual: any): boolean;

        /**
         * Asserts that two values are equal.
         *
         * @param expected First value to compare
         * @param actual Second value to compare
         * @param [delta = 0.0] Allowed numerical distance between two values to consider them equal
         * @param [ignoreCase = false] Case is ignored when set to true
         *
         * @throws {Jymfony.Component.Testing.Comparator.ComparisonFailure}
         */
        abstract assertEquals(expected: any, actual: any, delta?: number, ignoreCase?: boolean): void;
    }
}
