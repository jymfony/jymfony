declare namespace Jymfony.Component.Autoloader.Parser.SourceMap {
    /**
     * A data structure to provide a sorted view of accumulated mappings in a
     * performance conscious manner. It trades a negligible overhead in general
     * case for a large speedup in case of mappings being added in order.
     */
    export class MappingList {
        private _array: Mapping[];
        private _sorted: boolean;
        private _last: { generatedColumn: number; generatedLine: number };

        constructor();

        /**
         * Add the given source mapping.
         */
        add(mapping: Mapping): void;

        /**
         * Returns the flat, sorted array of mappings. The mappings are sorted by
         * generated position.
         *
         * WARNING: This method returns internal data without copying, for
         * performance. The return value must NOT be mutated, and should be treated as
         * an immutable borrow. If you want to take ownership, you must make your own
         * copy.
         */
        toArray(): Mapping[];
    }
}
