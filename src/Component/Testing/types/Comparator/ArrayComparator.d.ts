declare namespace Jymfony.Component.Testing.Comparator {
    import Comparator = Jymfony.Component.Testing.Comparator.Comparator;
    import ComparatorFactory = Jymfony.Component.Testing.Comparator.ComparatorFactory;

    /**
     * Compares arrays for equality.
     */
    export class ArrayComparator extends Comparator {
        private _comparatorFactory: ComparatorFactory;

        /**
         * Constructor.
         */
        __construct(comparatorFactory: ComparatorFactory): void;
        constructor(comparatorFactory: ComparatorFactory);

        /**
         * @inheritdoc
         */
        accepts(expected: any, actual: any): boolean;

        /**
         * @inheritdoc
         */
        assertEquals(expected: any, actual: any, delta?: number, ignoreCase?: boolean, processed?: Set<any>): boolean;

        private _indent(lines: string): string;
    }
}
