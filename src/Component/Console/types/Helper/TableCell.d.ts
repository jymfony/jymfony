declare namespace Jymfony.Component.Console.Helper {
    interface TableCellOptions {
        colspan?: number;
    }

    export class TableCell {
        private _value: string;
        private _options: TableCellOptions;

        /**
         * Constructor.
         */
        __construct(value?: any, options?: TableCellOptions): void;
        constructor(value?: any, options?: TableCellOptions);

        /**
         * Returns the cell value.
         */
        toString(): string;

        /**
         * Gets number of colspan.
         */
        public readonly colspan: number;
    }
}
