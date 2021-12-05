declare namespace Jymfony.Component.Testing.Comparator {
    import ScalarComparator = Jymfony.Component.Testing.Comparator.ScalarComparator;

    /**
     * Compares numerical values for equality.
     */
    export class NumericComparator extends ScalarComparator {
        /**
         * @inheritdoc
         */
        accepts(expected: any, actual: any): boolean;

        /**
         * @inheritdoc
         */
        assertEquals(expected: any, actual: any, delta?: number, ignoreCase?: boolean): void;
    }
}
