declare namespace Jymfony.Component.VarDumper.Cloner {
    import DataDumperInterface = Jymfony.Component.VarDumper.Dumper.DataDumperInterface;

    export class Data {
        private _data: any;
        private _position: number;
        private _key: number;
        private _maxDepth: number;
        private _maxItemsPerDepth: number;

        __construct(data: any): void;
        constructor(data: any);

        /**
         * Gets the type of the value.
         */
        public type: string;

        /**
         * Gets the value contained in the data.
         *
         * @param recursive Whether the value should be resolved recursively or not.
         *
         * @returns A native representation of the original value.
         */
        getValue(recursive?: boolean): any;

        public length: number;

        /**
         * Seeks to a specific key in nested data structures.
         *
         * @param {string|int} key
         *
         * @returns {Jymfony.Component.VarDumper.Cloner.Data|null} A clone of this Data or null if the key is not set.
         */
        seek(key: string|number): Data|null;

        dump(dumper: DataDumperInterface): void;

        [Symbol.iterator](): IterableIterator<[number|string|symbol, any]>;

        toString(): string;


        /**
         * Returns a depth limited clone of $this.
         *
         * @param maxDepth The max dumped depth level
         *
         * @returns A clone of this
         */
        withMaxDepth(maxDepth: number): this;

        /**
         * Limits the number of elements per depth level.
         *
         * @param maxItemsPerDepth The max number of items dumped per depth level
         *
         * @returns A clone of this
         */
        withMaxItemsPerDepth(maxItemsPerDepth: number): this;

        /**
         * Depth-first dumping of items.
         */
        private _dumpItem(dumper: DumperInterface, cursor: Cursor, refs: any[], item: any);

        /**
         * Dumps children of hash structures.
         */
        private _dumpChildren(dumper: DumperInterface, parentCursor: Cursor, refs: any[], children: any, cut: number, type: number): number;

        private _getStub(item: any): Stub|any;
    }
}
