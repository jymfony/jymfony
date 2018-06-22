const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const Helper = Jymfony.Component.Console.Helper.Helper;
const TableCell = Jymfony.Component.Console.Helper.TableCell;
const TableSeparator = Jymfony.Component.Console.Helper.TableSeparator;
const TableStyle = Jymfony.Component.Console.Helper.TableStyle;
const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;

/**
 * @memberOf Jymfony.Component.Console.Helper
 */
class Table {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output - An OutputInterface instance
     */
    __construct(output) {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._headers = [];

        /**
         * @type {string[]}
         *
         * @private
         */
        this._rows = [];

        /**
         * @type {int}
         *
         * @private
         */
        this._numberOfColumns = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._numberOfHeaders = 0;

        /**
         * @type {int}
         *
         * @private
         */
        this._numberOfRows = 0;

        /**
         * @type {int[]}
         *
         * @private
         */
        this._effectiveColumnWidths = [];

        /**
         * @type {Array}
         *
         * @private
         */
        this._columnStyles = [];

        /**
         * @var {int[]}
         *
         * @private
         */
        this._columnWidths = [];

        /**
         * @type {Jymfony.Component.Console.Output.OutputInterface}
         *
         * @private
         */
        this._output = output;

        /**
         * @type {Object<string, Jymfony.Component.Console.Helper.TableStyle>}
         *
         * @static
         */
        Table._styles = Table._initStyles();

        this.style = 'default';
    }

    /**
     * @returns {Object<string, Jymfony.Component.Console.Helper.TableStyle>}
     *
     * @static
     */
    static get styles() {
        return Table._styles;
    }

    /**
     * @param {Object<string, Jymfony.Component.Console.Helper.TableStyle>} styles
     *
     * @static
     */
    static set styles(styles) {
        Table._styles = styles;
    }

    /**
     * Sets a style definition.
     *
     * @param {string} name - The style name
     * @param {Jymfony.Component.Console.Helper.TableStyle} style - A TableStyle instance
     */
    static setStyleDefinition(name, style) {
        if (! Table._styles) {
            Table.styles = Table._initStyles();
        }

        Table._styles[name] = style;
    }

    /**
     * Gets a style definition by name.
     *
     * @param {string} name - The style name
     *
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
     */
    static getStyleDefinition(name) {
        if (undefined === Table._styles) {
            Table.styles = Table._initStyles();
        }

        if (!!Table.styles[name]) {
            return Table.styles[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Style "%s" is not defined.', name));
    }

    /**
     * Gets the current table style.
     *
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
     */
    get style() {
        return this._style;
    }

    /**
     * Sets table style.
     *
     * @param {Jymfony.Component.Console.Helper.TableStyle|string} name - The style name or a TableStyle instance
     */
    set style(name) {
        this._style = this._resolveStyle(name);
    }

    /**
     * Gets the current style for a column.
     *
     * If style was not set, it returns the global table style.
     *
     * @param {int} columnIndex - Column index
     *
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
     */
    getColumnStyle(columnIndex) {
        return !!this._columnStyles[columnIndex] ? this._columnStyles[columnIndex] : this.style;
    }

    /**
     * Sets table column style.
     *
     * @param {int} columnIndex - Column index
     * @param {TableStyle|string} name - The style name or a TableStyle instance
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setColumnStyle(columnIndex, name) {
        this._columnStyles[columnIndex] = this._resolveStyle(name);

        return this;
    }

    /**
     * Sets the minimum width of a column.
     *
     * @param {int} columnIndex - Column index
     * @param {int} width - Minimum column width in characters
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setColumnWidth(columnIndex, width) {
        this._columnWidths[columnIndex] = width;

        return this;
    }

    /**
     * Sets the minimum width of all columns.
     *
     * @param {Array} widths
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setColumnWidths(widths) {
        this._columnWidths = [];
        for (let i = 0; i < widths.length; ++i) {
            this.setColumnWidth(i, widths[i]);
        }

        return this;
    }

    /**
     * Sets the headers.
     *
     * @param {string[]|Jymfony.Component.Console.Helper.TableCell[]|Jymfony.Component.Console.Helper.TableSeparator[]} headers
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setHeaders(headers) {
        if (0 < headers.length && !isArray(headers[0])) {
            headers = [ headers ];
        }

        this._headers = headers;

        return this;
    }

    /**
     * @param {string[]|Jymfony.Component.Console.Helper.TableCell[]|Jymfony.Component.Console.Helper.TableSeparator[]} rows
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setRows(rows) {
        this._rows = [];

        return this.addRows(rows);
    }

    /**
     * @param {string[]|Jymfony.Component.Console.Helper.TableCell[]|Jymfony.Component.Console.Helper.TableSeparator[]} rows
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    addRows(rows) {
        for (const row of rows) {
            this.addRow(row);
        }

        return this;
    }

    /**
     * @param {string|Jymfony.Component.Console.Helper.TableCell|Jymfony.Component.Console.Helper.TableSeparator} row
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    addRow(row) {
        if (row instanceof TableSeparator) {
            this._rows.push(row);

            return this;
        }

        if (!isArray(row)) {
            throw new InvalidArgumentException('A row must be an array or a TableSeparator instance.');
        }

        this._rows.push(row);

        return this;
    }

    /**
     * @param {int} column
     * @param {Array} row
     *
     * @returns {Jymfony.Component.Console.Helper.Table}
     */
    setRow(column, row) {
        this._rows[column] = row;

        return this;
    }

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
    render() {
        this._calculateNumberOfColumns();
        this._calculateNumberOfRows();
        this._calculateNumberOfHeaders();

        let headers = this._buildEmptyTableRows(this._numberOfHeaders);
        let rows = this._buildEmptyTableRows(this._numberOfRows);

        if (0 < this._numberOfHeaders) {
            headers = this._fillTableRows(headers, this._headers);
        }

        rows = this._fillTableRows(rows, this._rows);

        this._calculateColumnsWidth(__jymfony.deepClone([].concat(headers, rows)));

        this._renderRowSeparator();

        if (0 < this._numberOfHeaders) {
            for (const header of headers) {
                this._renderRow(header, this.style.getCellHeaderFormat());
                this._renderRowSeparator();
            }
        }

        for (const row of rows) {
            if (row instanceof TableSeparator) {
                this._renderRowSeparator();
            } else {
                this._renderRow(row, this.style.getCellRowFormat());
            }
        }

        if (0 < rows.length) {
            this._renderRowSeparator();
        }

        this._cleanup();

        //rows = this._buildTableRows(rows);
        //const headers = this._buildTableRows(this._headers);
        //
        //this._calculateColumnsWidth(__jymfony.deepClone([].concat(headers, rows)));
        //
        //this._renderRowSeparator();
        //if (0 < headers.length) {
        //    for (const header of headers) {
        //        this._renderRow(header, this.style.getCellHeaderFormat());
        //        this._renderRowSeparator();
        //    }
        //}
        //
        //for (const row of rows) {
        //    if (row instanceof TableSeparator) {
        //        this._renderRowSeparator();
        //    } else {
        //        this._renderRow(row, this.style.getCellRowFormat());
        //    }
        //}
        //
        //if (0 < rows.length) {
        //    this._renderRowSeparator();
        //}
        //
        //this._cleanup();
    }

    /**
     * Renders horizontal header separator.
     *
     * Example: +-----+-----------+-------+
     *
     * @private
     */
    _renderRowSeparator() {
        const count = this._numberOfColumns;
        if (0 === count) {
            return;
        }

        const crossingChar = this.style.getCrossingChar();
        const horizontalBorderChar = this.style.getHorizontalBorderChar();
        if (!horizontalBorderChar && !crossingChar) {
            return;
        }

        let markup = crossingChar;
        for (let column = 0; column < count; ++column) {
            markup += horizontalBorderChar.repeat(this._effectiveColumnWidths[column]) + crossingChar;
        }

        this._output.writeln(__jymfony.sprintf(this.style.getBorderFormat(), markup));
    }

    /**
     * Renders vertical column separator.
     *
     * @private
     */
    _renderColumnSeparator() {
        return __jymfony.sprintf(this.style.getBorderFormat(), this.style.getVerticalBorderChar());
    }

    /**
     * Renders table row.
     *
     * Example: | 9971-5-0210-0 | A Tale of Two Cities  | Charles Dickens  |
     *
     * @param {Array} row
     * @param {string} cellFormat
     *
     * @private
     */
    _renderRow(row, cellFormat) {
        if (! isArray(row) || 0 === row.length) {
            return;
        }

        let rowContent = this._renderColumnSeparator();
        for (const column of this._getRowColumns(row)) {
            rowContent += this._renderCell(row, column, cellFormat);
            rowContent += this._renderColumnSeparator();
        }

        this._output.writeln(rowContent);
    }

    /**
     * Renders table cell with padding.
     *
     * @param {Array} row
     * @param {int} column
     * @param {string} cellFormat
     *
     * @private
     */
    _renderCell(row, column, cellFormat) {
        const cell = !!row[column] ? row[column] : '';
        let width = this._effectiveColumnWidths[column];

        if (cell instanceof TableCell && 1 < cell.getColspan()) {
            // Add the width of the following columns(numbers of colspan).
            for (let nextColumn = column + 1; nextColumn <= column + cell.getColspan() - 1; ++nextColumn) {
                width += this._getColumnSeparatorWidth() + this._effectiveColumnWidths[nextColumn];
            }
        }

        const style = this.getColumnStyle(column);
        if (cell instanceof TableSeparator) {
            return __jymfony.sprintf(style.getBorderFormat(), style.getHorizontalBorderChar().repeat(width));
        }

        width += cell.toString().length - Helper.strlenWithoutDecoration(this._output.formatter, cell);
        const content = __jymfony.sprintf(style.getCellRowContentFormat(), cell);

        return __jymfony.sprintf(cellFormat, __jymfony.str_pad(content, width, style.getPaddingChar(), style.getPadType()));
    }

    /**
     * Calculate number of columns for this table.
     *
     * @private
     */
    _calculateNumberOfColumns() {
        if (this._numberOfColumns) {
            return;
        }

        const columns = [ 0 ];

        for (const row of [].concat(this._headers, this._rows)) {
            if (row instanceof TableSeparator) {
                continue;
            }

            columns.push(this._getNumberOfColumns(row));
        }

        this._numberOfColumns = Math.max(...columns);
    }

    /**
     * Gets number of columns by row.
     *
     * @param {Array} row
     *
     * @returns {int}
     *
     * @private
     */
    _getNumberOfColumns(row) {
        let columns = row.length;

        for (const cell of row) {
            columns += cell instanceof TableCell ? cell.getColspan() - 1 : 0;
        }

        return columns;
    }

    /**
     * Calculate number of rows for this table.
     *
     * @private
     */
    _calculateNumberOfRows() {
        if (this._numberOfRows) {
            return;
        }

        let rows = 0;

        for (const row of this._rows) {
            if (row instanceof TableSeparator) {
                ++rows;
                continue;
            }

            rows += this._getNumberOfRows(row);
        }

        this._numberOfRows = rows;
    }

    /**
     * Gets number of rows by cell.
     *
     * @param {Array} row
     *
     * @returns {int}
     *
     * @private
     */
    _getNumberOfRows(row) {
        let rows = 1;

        for (const cell of row) {
            rows += cell instanceof TableCell ? cell.getRowspan() - 1 : 0;
            rows += (cell.toString().match(/\\n/g) || []).length;
        }

        return rows;
    }

    /**
     * Calculate number of headers for this table.
     *
     * @private
     */
    _calculateNumberOfHeaders() {
        if (this._numberOfHeaders) {
            return;
        }

        let headers = 0;

        for (const header of this._headers) {
            if (header instanceof TableSeparator) {
                continue;
            }

            headers += this._getNumberOfHeaders(header);
        }

        this._numberOfHeaders = headers;
    }

    /**
     * Gets number of headers by cell.
     *
     * @param {Array} header
     *
     * @returns {int}
     *
     * @private
     */
    _getNumberOfHeaders(header) {
        let headers = 1;

        for (const cell of header) {
            headers += (cell.toString().match(/\\n/g) || []).length;
        }

        return headers;
    }

    /**
     * @returns {Array}
     *
     * @private
     */
    _buildEmptyTableRows(numberOfRows) {
        const tableRows = [];
        for (let rowNumber = 0; rowNumber < numberOfRows; ++rowNumber) {
            const row = [];

            for (let columnNumber = 0; columnNumber < this._numberOfColumns; ++columnNumber) {
                row.push('');
            }

            tableRows.push(row);
        }

        return tableRows;
    }

    _fillTableRows(renderedTableRows, rows) {
        for (let rowNumber = 0; rowNumber < rows.length; ++rowNumber) {
            let row = rows[rowNumber];
            if (row instanceof TableSeparator) {
                renderedTableRows[rowNumber] = row;
                continue;
            }

            for (const [column, cell] of __jymfony.getEntries(row)) {
                renderedTableRows[rowNumber][column] = cell;
            }
        }

        return renderedTableRows
    }

    /**
     * @param {Array} rows
     *
     * @returns {Array}
     *
     * @private
     */
    _buildTableRows(rows) {
        const unmergedRows = [];

        for (let rowNumber = 0; rowNumber < rows.length; ++rowNumber) {
            rows = this._fillNextRows(rows, rowNumber);

            // Remove any new line breaks and replace it with a new line
            for (const [ column, cell ] of __jymfony.getEntries(rows[rowNumber])) {
                if (-1 === cell.toString().indexOf('\n')) {
                    continue;
                }

                const lines = cell.toString().replace('\n', '<fg=default;bg=default>\n</>').split('\n');
                for (let [ lineKey, line ] of __jymfony.getEntries(lines)) {
                    if (cell instanceof TableCell) {
                        line = new TableCell(line, { colspan: cell.getColspan() });
                    }

                    if (0 === lineKey) {
                        rows[rowNumber][column] = line;
                    } else {
                        if (! unmergedRows[rowNumber]) {
                            unmergedRows[rowNumber] = [];

                            for (let i = 0; i < this._numberOfColumns; ++i) {
                                unmergedRows[rowNumber][i] = '';
                            }
                        }

                        if (! unmergedRows[rowNumber][lineKey]) {
                            unmergedRows[rowNumber][lineKey] = [];

                            for (let i = 0; i < this._numberOfColumns; ++i) {
                                unmergedRows[rowNumber][lineKey][i] = '';
                            }
                        }

                        unmergedRows[rowNumber][lineKey][column] = line;
                    }
                }
            }
        }

        let temp = [];

        for (let rowNumber = 0; rowNumber < rows.length; ++rowNumber) {
            temp.push(this._fillCells(rows[rowNumber]));
            if (!!unmergedRows[rowNumber] && '' !== unmergedRows[rowNumber]) {
                temp = [].concat(temp, unmergedRows[rowNumber]);
            }
        }

        let tableRows = [];
        for (let rowNumber = 0; rowNumber < temp.length; ++rowNumber) {
            if ('' === temp[rowNumber]) {
                continue;
            }

            tableRows.push(temp[rowNumber]);
        }

        return tableRows;
    }

    /**
     * Fill rows that contains rowspan > 1.
     *
     * @param {Array} rows
     * @param {int} line
     *
     * @returns {Array}
     *
     * @private
     */
    _fillNextRows(rows, line) {
        const unmergedRows = [];

        for (const [ column, cell ] of __jymfony.getEntries(rows[line])) {
            if (rows[line] instanceof TableSeparator) {
                continue;
            }

            if (null !== cell && !(cell instanceof TableCell) && !isScalar(cell)) {
                throw new InvalidArgumentException(__jymfony.sprintf('A cell must be a TableCell or a scalar, %s given.', typeof(cell)));
            }

            if (cell instanceof TableCell && 1 < cell.getRowspan()) {
                let nbLines = cell.getRowspan() - 1;
                const lines = [ cell ];

                let cellValue = cell.toString();
                if (-1 < cellValue.indexOf('\n')) {
                    const lines = cellValue.replace('\n', '<fg=default;bg=default>\n</>').split('\n');
                    nbLines = cellValue.split('\n').length - 1;

                    rows[line][column] = new TableCell(lines[0], { colspan: cell.getColspan() });
                    lines[0].shift();
                }

                // Create a two dimensional array (rowspan x colspan)
                for (let i = 0; i <= nbLines; ++i) {
                    unmergedRows[i + line] = [];
                }

                for (const [ unmergedRowKey, unmergedRow ] of __jymfony.getEntries(unmergedRows)) {
                    const value = undefined !== lines[unmergedRowKey - line] ? lines[unmergedRowKey - line] : '';

                    unmergedRows[unmergedRowKey][column] = new TableCell(value, { colspan: cell.getColspan() });
                    if (nbLines === unmergedRowKey - line) {
                        break;
                    }
                }
            }
        }

        for (const [ unmergedRowKey, unmergedRow ] of __jymfony.getEntries(unmergedRows)) {
            // We need to know if unmergedRow will be merged or inserted into rows
            if (!!rows[unmergedRowKey] && isArray(rows[unmergedRowKey]) &&
                this._getNumberOfColumns(rows[unmergedRowKey]) + this._getNumberOfColumns(unmergedRows[unmergedRowKey]) <= this._numberOfColumns) {

                for (const [ cellKey, cell ] of __jymfony.getEntries(unmergedRow)) {
                    // Insert cell into row at cellKey position
                    rows[unmergedRowKey].splice(cellKey, 0, [ cell ]);
                }
            } else {
                const row = this._copyRow(rows, unmergedRowKey - 1);
                for (const [ column, cell ] of __jymfony.getEntries(unmergedRow)) {
                    if (!!cell) {
                        row[column] = unmergedRow[column];
                    }
                }

                rows.splice(unmergedRowKey, 0, [ row ]);
            }
        }

        return rows;
    }

    /**
     * Fill cells for a row that contains colspan > 1.
     *
     * @param {Array} row
     *
     * @returns {Array}
     *
     * @private
     */
    _fillCells(row) {
        const newRow = [];

        for (const [ cellKey, cell ] of __jymfony.getEntries(row)) {
            newRow.push(cell);

            if (cell instanceof TableCell && 1 < cell.getColspan()) {
                for (let position = cellKey; position < cellKey + cell.getColspan() - 1; ++position) {
                    // Insert empty value at column position
                    newRow.push('');
                }
            }
        }

        return 0 === newRow.length ? newRow : row;
    }

    /**
     * @param {Array} rows
     * @param {int} line
     *
     * @returns {Array}
     *
     * @private
     */
    _copyRow(rows, line) {
        const row = rows[line];
        for (const [ cellKey, cell ] of __jymfony.getEntries(row)) {
            row[cellKey] = '';

            if (cell instanceof TableCell) {
                row[cellKey] = new TableCell('', { colspan: cell.getColspan() });
            }
        }

        return row;
    }

    /**
     * Gets list of columns for the given row.
     *
     * @param {Array} row
     *
     * @returns {Array}
     *
     * @private
     */
    _getRowColumns(row) {
        let columns = [...Array(this._numberOfColumns).keys()];
        for (const [ cellKey, cell ] of __jymfony.getEntries(row)) {
            if (cell instanceof TableCell && 1 < cell.getColspan()) {
                const range = [];
                for (let i = cellKey + 1; i <= cellKey + cell.getColspan() - 1; ++i) {
                    range.push(i);
                }

                columns = columns.filter(x => -1 === range.indexOf(x));
            }
        }

        return columns;
    }

    /**
     * Calculates columns widths.
     *
     * @param {Array} rows
     *
     * @private
     */
    _calculateColumnsWidth(rows) {
        for (let column = 0; column < this._numberOfColumns; ++column) {
            const lengths = [];

            for (const row of rows) {
                if (row instanceof TableSeparator) {
                    continue;
                }

                for (const [ i, cell ] of __jymfony.getEntries(row)) {
                    if (cell instanceof TableCell) {
                        const textContent = Helper.removeDecoration(this._output.formatter, cell);
                        const textLength = textContent.length;

                        if (0 < textLength) {
                            const contentColumns = [];
                            const step = Math.ceil(textLength / cell.getColspan());
                            for (let counter = 0; counter < textLength; counter += step) {
                                contentColumns.push(textContent.substr(counter, step));
                            }

                            for (const [ position, content ] of __jymfony.getEntries(contentColumns)) {
                                row[i + position] = content;
                            }
                        }
                    }
                }

                lengths.push(this._getCellWidth(row, column));
            }

            this._effectiveColumnWidths[column] = Math.max(...lengths) + this.style.getCellRowContentFormat().length - 2;
        }
    }

    /**
     * @returns {int}
     *
     * @private
     */
    _getColumnSeparatorWidth() {
        return __jymfony.sprintf(this.style.getBorderFormat(), this.style.getVerticalBorderChar()).length;
    }

    /**
     * @param {Array} row
     * @param {int} column
     *
     * @returns {int}
     *
     * @private
     */
    _getCellWidth(row, column) {
        let cellWidth = 0;

        if (!!row[column]) {
            const cell = row[column];
            cellWidth = Helper.strlenWithoutDecoration(this._output.formatter, cell);
        }

        const columnWidth = undefined !== this._columnWidths[column] ? this._columnWidths[column] : 0;

        return Math.max(cellWidth, columnWidth);
    }

    /**
     * Called after rendering to cleanup cache data.
     *
     * @private
     */
    _cleanup() {
        this._effectiveColumnWidths = [];
        this._numberOfColumns = 0;
        this._numberOfRows = 0;
        this._numberOfHeaders = 0;
    }

    /**
     * @returns {Object.<string, Jymfony.Component.Console.Helper.TableStyle>}
     *
     * @private
     */
    static _initStyles() {
        const borderless = new TableStyle();
        borderless
            .setHorizontalBorderChar('=')
            .setVerticalBorderChar(' ')
            .setCrossingChar(' ')
        ;

        const compact = new TableStyle();
        compact
            .setHorizontalBorderChar('')
            .setVerticalBorderChar(' ')
            .setCrossingChar('')
            .setCellRowContentFormat('%s')
        ;

        const styleGuide = new TableStyle();
        styleGuide
            .setHorizontalBorderChar('-')
            .setVerticalBorderChar(' ')
            .setCrossingChar(' ')
            .setCellHeaderFormat('%s')
        ;

        return {
            'default': new TableStyle(),
            'borderless': borderless,
            'compact': compact,
            'jymfony-style-guide': styleGuide,
        };
    }

    /**
     * @param {Jymfony.Component.Console.Helper.TableStyle|string} name
     *
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
     *
     * @private
     */
     _resolveStyle(name) {
        if (name instanceof TableStyle) {
            return name;
        }

        if (!!Table._styles[name]) {
            return Table._styles[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Style "%s" is not defined.', name));
    }
}

module.exports = Table;
