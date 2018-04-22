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
     * @param {OutputInterface} output An OutputInterface instance
     * @private
     */
    __construct(output) {
        /**
         * Table headers.
         *
         * @type {string[]}
         * @private
         */
        this._headers = [];

        /**
         * Table rows.
         *
         * @type {Array}
         * @private
         */
        this._rows = [];

        /**
         * Number of columns cache.
         *
         * @type {int}
         * @private
         */
        this._numberOfColumns = 0;

        /**
         * Column widths cache.
         *
         * @type {int[]}
         * @private
         */
        this._effectiveColumnWidths = [];

        /**
         * @type {Array}
         * @private
         */
        this._columnStyles = [];

        /**
         * User set column widths.
         *
         * @var {Array}
         * @private
         */
        this._columnWidths = [];

        /**
         * @type {OutputInterface}
         * @private
         */
        this._output = output;

        /**
         * @type {Object<string, TableStyle>}
         * @private
         */
        this._styles = {};

        Table._initStyles();

        this.style = 'default';
    }

    get styles() {
        return this._styles;
    }

    set styles(styles) {
        this._styles = styles;
    }

    /**
     * Sets a style definition.
     *
     * @param {string} name The style name
     * @param {TableStyle} style A TableStyle instance
     */
    static setStyleDefinition(name, style) {
        if (! Table._styles) {
            Table._styles = this._initStyles();
        }

        Table._styles[name] = style;
    }

    /**
     * Gets a style definition by name.
     *
     * @param {string} name The style name
     *
     * @return {TableStyle}
     */
    static getStyleDefinition(name) {
        if (__jymfony.equal({}, this.styles)) {
            this.styles = Table._initStyles();
        }

        if (!!Table.styles[name]) {
            return Table.styles[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Style "%s" is not defined.', name));
    }

    /**
     * Gets the current table style.
     *
     * @return {TableStyle}
     */
    get style() {
        return this._style;
    }

    /**
     * Sets table style.
     *
     * @param {TableStyle|string} name The style name or a TableStyle instance
     */
    set style(name) {
        this._style = this._resolveStyle(name);
    }

    /**
     * Gets the current style for a column.
     *
     * If style was not set, it returns the global table style.
     *
     * @param {int} columnIndex Column index
     *
     * @return TableStyle
     */
    getColumnStyle(columnIndex) {
        return !!this._columnStyles[columnIndex] ? this._columnStyles[columnIndex] : this.style;
    }

    /**
     * Sets table column style.
     *
     * @param {int} columnIndex Column index
     * @param {TableStyle|string} name The style name or a TableStyle instance
     *
     * @return {Table}
     */
    setColumnStyle(columnIndex, name) {
        this._columnStyles[columnIndex] = this._resolveStyle(name);

        return this;
    }

    /**
     * Sets the minimum width of a column.
     *
     * @param {int} columnIndex Column index
     * @param {int} width Minimum column width in characters
     *
     * @return {Table}
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
     * @return {Table}
     */
    setColumnWidths(widths) {
        this._columnWidths = [];
        for (let i = 0; i < widths.length; ++i) {
            this.setColumnWidth(i, widths[i]);
        }

        return this;
    }

    setHeaders(headers) {
        if (!!headers && !isArray(headers[0])) {
            headers = [ headers ];
        }

        this._headers = headers;

        return this;
    }

    setRows(rows) {
        this._rows = [];

        return this.addRows(rows);
    }

    addRows(rows) {
        for (const row of rows) {
            this.addRow(row);
        }

        return this;
    }

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
     * @returns {Table}
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
        const rows = this._buildTableRows(this._rows);
        const headers = this._buildTableRows(this._headers);

        this._calculateColumnsWidth(__jymfony.deepClone([].concat(headers, rows)));

        this._renderRowSeparator();
        if (0 < headers.length) {
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

                const lines = cell.replace('\n', '<fg=default;bg=default>\n</>').split('\n');
                for (let [ lineKey, line ] of __jymfony.getEntries(lines)) {
                    if (cell instanceof TableCell) {
                        line = new TableCell(line, { 'colspan': cell.getColspan() });
                    }

                    if (0 === lineKey) {
                        rows[rowNumber][column] = line;
                    } else {
                        unmergedRows[rowNumber][lineKey][column] = line;
                    }
                }
            }
        }

        let tableRows = [];
        for (let rowNumber = 0; rowNumber < rows.length; ++rowNumber) {
            tableRows.push(this._fillCells(rows[rowNumber]));

            if (!!unmergedRows[rowNumber]) {
                tableRows = [].concat(tableRows, unmergedRows[rowNumber]);
            }
        }

        return tableRows;
    }

    /**
     * Fill rows that contains rowspan > 1.
     *
     * @param {Array} rows
     * @param {int} line
     *
     * @return {Array}
     *
     * @private
     */
    _fillNextRows(rows, line) {
        const unmergedRows = [];

        for (const [ column, cell ] of __jymfony.getEntries(rows[line])) {
            if (null !== cell && !(cell instanceof TableCell) && !(cell instanceof TableSeparator) && !isScalar(cell)) {
                throw new InvalidArgumentException(__jymfony.sprintf('A cell must be a TableCell or a scalar, %s given.', typeof(cell)));
            }

            if (cell instanceof TableCell && 1 < cell.getRowspan()) {
                let nbLines = cell.getRowspan() - 1;
                const lines = [ cell ];

                if (-1 < cell.indexOf('\n')) {
                    const lines = cell.replace('\n', '<fg=default;bg=default>\n</>').split('\n');
                    nbLines = cell.split('\n').length - 1;

                    rows[line][column] = new TableCell(lines[0], { 'colspan': cell.getColspan() });
                    lines[0].shift();
                }

                // Create a two dimensional array (rowspan x colspan)
                for (let i = 0; i <= nbLines; ++i) {
                    unmergedRows[i + line] = [];
                }

                for (const [ unmergedRowKey, unmergedRow ] of __jymfony.getEntries(unmergedRows)) {
                    const value = undefined !== lines[unmergedRowKey - line] ? lines[unmergedRowKey - line] : '';

                    unmergedRows[unmergedRowKey][column] = new TableCell(value, { 'colspan': cell.getColspan() });
                    if (nbLines === unmergedRowKey - line) {
                        break;
                    }
                }
            }
        }

        for (const [ unmergedRowKey, unmergedRow ] of __jymfony.getEntries(unmergedRows)) {
            // We need to know if unmergedRow will be merged or inserted into $rows
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
     * @return {Array}
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
     * @return {Array}
     *
     * @private
     */
    _copyRow(rows, line) {
        const row = rows[line];
        for (const [ cellKey, cell ] of __jymfony.getEntries(row)) {
            row[cellKey] = '';

            if (cell instanceof TableCell) {
                row[cellKey] = new TableCell('', { 'colspan': cell.getColspan() });
            }
        }

        return row;
    }

    /**
     * Gets number of columns by row.
     *
     * @param {Array} row
     *
     * @return {int}
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
     * Gets list of columns for the given row.
     *
     * @param {Array} row
     *
     * @return {Array}
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
     * @private
     */
    _getColumnSeparatorWidth() {
        return __jymfony.sprintf(this.style.getBorderFormat(), this.style.getVerticalBorderChar()).length;
    }

    /**
     * @param {Array} row
     * @param {int} column
     *
     * @return {int}
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
        this._numberOfColumns = undefined;
    }

    /**
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

        Table._styles = {
            'default': new TableStyle(),
            'borderless': borderless,
            'compact': compact,
            'jymfony-style-guide': styleGuide,
        };
    }

    /**
     * @param {TableStyle|string} name
     *
     * @returns {TableStyle}
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
