declare namespace Jymfony.Component.Testing.Comparator {
    import Comparator = Jymfony.Component.Testing.Comparator.Comparator;

    /**
     * Compares values for type equality.
     */
    export class TypeComparator extends Comparator {
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
