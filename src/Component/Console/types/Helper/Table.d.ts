declare namespace Jymfony.Component.Console.Helper {
    import OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

    export class Table {
        public static readonly SEPARATOR_TOP = 0;
        public static readonly SEPARATOR_TOP_BOTTOM = 1;
        public static readonly SEPARATOR_MID = 2;
        public static readonly SEPARATOR_BOTTOM = 3;
        public static readonly BORDER_OUTSIDE = 0;
        public static readonly BORDER_INSIDE = 1;

        private _headers: string[];
        private _headerTitle: string;
        private _footerTitle: string;
        private _rows: string[];
        private _numberOfColumns: number;
        private _numberOfHeaders: number;
        private _numberOfRows: number;
        private _effectiveColumnWidths: number[];
        private _columnStyles: Record<number, TableStyle>;
        private _columnWidths: number[];
        private _output: OutputInterface;

        /**
         * Constructor.
         */
        __construct(output: OutputInterface): void;
        constructor(output: OutputInterface);

        /**
         * Sets a style definition.
         */
        static setStyleDefinition(name: string, style: TableStyle): void;

        /**
         * Gets a style definition by name.
         */
        static getStyleDefinition(name: string): TableStyle;

        /**
         * Gets/sets the current table style.
         *
         * @returns {Jymfony.Component.Console.Helper.TableStyle}
         */
        public style: TableStyle;

        /**
         * Gets the current style for a column.
         * If style was not set, it returns the global table style.
         */
        getColumnStyle(columnIndex: number): TableStyle;

        /**
         * Sets table column style.
         */
        setColumnStyle(columnIndex: number, name: TableStyle | string): this;

        /**
         * Sets the minimum width of a column.
         */
        setColumnWidth(columnIndex: number, width: number): this;

        /**
         * Sets the minimum width of all columns.
         */
        setColumnWidths(widths: number[]): this;

        /**
         * Sets the headers.
         */
        setHeaders(headers: (string | TableCell | TableSeparator)[]): this;

        setRows(rows: ((string | TableCell)[] | TableSeparator)[]): this;
        addRows(rows: ((string | TableCell)[] | TableSeparator)[]): this;
        addRow(row: (string | TableCell)[] | TableSeparator): this;

        /**
         * Sets the header title.
         */
        public /* writeonly */ headerTitle: string;

        /**
         * Sets the footer section title.
         */
        public /* writeonly */ footerTitle: string;

        /**
         * Renders table to output.
         *
         * Example:
         * +---------------+-----------------------+------------------+
         * | ISBN          | Title                 | Author           |
         * +---------------+-----------------------+------------------+
         * | 99921-58-10-7 | Divine Comedy         | Dante Alighieri  |
         * | 9971-5-0210-0 | A Tale of Two Cities  | Charles Dickens  |
         * | 960-425-059-0 | The Lord of the Rings | J. R. R. Tolkien |
         * +---------------+-----------------------+------------------+
         */
        render(): void;

        /**
         * Renders horizontal header separator.
         *
         * Example: +-----+-----------+-------+
         */
        private _renderRowSeparator(type?: number, title?: null | string, titleFormat?: null | string): void;

        /**
         * Renders vertical column separator.
         */
        private _renderColumnSeparator(type?: number): string;

        /**
         * Renders table row.
         *
         * Example: | 9971-5-0210-0 | A Tale of Two Cities  | Charles Dickens  |
         */
        private _renderRow(row: any[], cellFormat: string): void;

        /**
         * Renders table cell with padding.
         */
        private _renderCell(row: (TableCell | string)[], column: number, cellFormat: string): string;

        /**
         * Calculate number of columns for this table.
         */
        private _calculateNumberOfColumns(rows: any[]): void;

        /**
         * Gets number of columns by row.
         *
         * @param {Array} row
         *
         * @returns {int}
         *
         * @private
         */
        private _getNumberOfColumns(row: any[]): number;

        private _buildTableRows(rows: ((TableCell | string)[] | TableSeparator)[]): TableRows;

        /**
         * Fill cells for a row that contains colspan > 1.
         */
        private _fillCells<T = any>(row: T): T;

        /**
         * Gets list of columns for the given row.
         */
        private _getRowColumns(row: any[]): any[];

        /**
         * Calculates columns widths.
         */
        private _calculateColumnsWidth(rows: any[]): void;

        private _getColumnSeparatorWidth(): number;
        private _getCellWidth(row: any[], column: number): number;

        /**
         * Called after rendering to cleanup cache data.
         */
        private _cleanup(): void;

        private _resolveStyle(name: string | TableStyle): TableStyle;
    }
}
