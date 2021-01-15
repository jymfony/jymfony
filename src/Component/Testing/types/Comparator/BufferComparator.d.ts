declare namespace Jymfony.Component.Testing.Comparator {
    import Comparator = Jymfony.Component.Testing.Comparator.Comparator;

    /**
     * Compares scalar or NULL values for equality.
     */
    export class BufferComparator extends Comparator {
        /**
         * @inheritdoc
         */
        accepts(expected: Buffer, actual: Buffer): true;
        accepts(expected: any, actual: any): boolean;

        /**
         * @inheritdoc
         */
        assertEquals(expected: any, actual: any, delta?: number, ignoreCase?: boolean): void;
    }
}
