declare namespace Jymfony.Component.Testing.Comparator {
    /**
     * Compares function values.
     */
    export class FunctionComparator extends Comparator {
        /**
         * @inheritdoc
         */
        accepts(expected: any, actual: any): boolean;

        /**
         * @inheritdoc
         */
        assertEquals(expected: any, actual: any, delta?: number, ignoreCase?: boolean): void;

        private _equal(expected: any, actual: any): boolean;
    }
}
