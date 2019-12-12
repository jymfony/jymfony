const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;
const Helper = Jymfony.Component.Console.Helper.Helper;
const TableCell = Jymfony.Component.Console.Helper.TableCell;
const TableSeparator = Jymfony.Component.Console.Helper.TableSeparator;
const TableRows = Jymfony.Component.Console.Helper.TableRows;
const TableStyle = Jymfony.Component.Console.Helper.TableStyle;
const OutputFormatter = Jymfony.Component.Console.Formatter.OutputFormatter;

let styles = undefined;
function initStyles() {
    const borderless = new TableStyle();
    borderless.setHorizontalBorderChars('=');
    borderless.setVerticalBorderChars(' ');
    borderless.defaultCrossingChar = ' ';

    const compact = new TableStyle();
    compact.setHorizontalBorderChars('');
    compact.setVerticalBorderChars(' ');
    compact.defaultCrossingChar = '';
    compact.cellRowContentFormat = '%s';

    const styleGuide = new TableStyle();
    styleGuide.setHorizontalBorderChars('-');
    styleGuide.setVerticalBorderChars(' ');
    styleGuide.defaultCrossingChar = ' ';
    styleGuide.cellHeaderFormat = '%s';

    const box = new TableStyle();
    box.setHorizontalBorderChars('─');
    box.setVerticalBorderChars('│');
    box.setCrossingChars('┼', '┌', '┬', '┐', '┤', '┘', '┴', '└', '├');

    const boxDouble = new TableStyle();
    boxDouble.setHorizontalBorderChars('═', '─');
    boxDouble.setVerticalBorderChars('║', '│');
    boxDouble.setCrossingChars('┼', '╔', '╤', '╗', '╢', '╝', '╧', '╚', '╟', '╠', '╪', '╣');

    styles = {
        'default': new TableStyle(),
        borderless,
        compact,
        'jymfony-style-guide': styleGuide,
        box,
        'box-double': boxDouble,
    };
}

/**
 * @memberOf Jymfony.Component.Console.Helper
 */
export default class Table {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Console.Output.OutputInterface} output An OutputInterface instance
     */
    __construct(output) {
        /**
         * @type {string[]}
         *
         * @private
         */
        this._headers = [];

        /**
         * @type {string}
         *
         * @private
         */
        this._headerTitle = undefined;

        /**
         * @type {string}
         *
         * @private
         */
        this._footerTitle = undefined;

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
         * @type {Object.<number, Jymfony.Component.Console.Helper.TableStyle>}
         *
         * @private
         */
        this._columnStyles = {};

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

        initStyles();
        this.style = 'default';
    }

    /**
     * Sets a style definition.
     *
     * @param {string} name The style name
     * @param {Jymfony.Component.Console.Helper.TableStyle} style A TableStyle instance
     */
    static setStyleDefinition(name, style) {
        if (undefined === styles) {
            initStyles();
        }

        styles[name] = style;
    }

    /**
     * Gets a style definition by name.
     *
     * @param {string} name The style name
     *
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
     */
    static getStyleDefinition(name) {
        if (undefined === styles) {
            initStyles();
        }

        if (!! styles[name]) {
            return styles[name];
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
     * @param {Jymfony.Component.Console.Helper.TableStyle|string} name The style name or a TableStyle instance
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
     * @returns {Jymfony.Component.Console.Helper.TableStyle}
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
     * @returns {Jymfony.Component.Console.Helper.Table}
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

        if (! isArray(row)) {
            throw new InvalidArgumentException('A row must be an array or a TableSeparator instance.');
        }

        this._rows.push(row);

        return this;
    }

    /**
     * Sets the header title.
     *
     * @param {string} title
     */
    set headerTitle(title) {
        this._headerTitle = title;
    }

    /**
     * Sets the footer section title.
     *
     * @param {string} title
     */
    set footerTitle(title) {
        this._footerTitle = title;
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
        const divider = new TableSeparator();
        let rows = [].concat(this._headers, [ divider ], this._rows);

        this._calculateNumberOfColumns(rows);
        rows = this._buildTableRows(rows);
        this._calculateColumnsWidth(rows);

        let isHeader = true;
        let isFirstRow = false;
        for (const row of rows) {
            if (divider === row) {
                isHeader = false;
                isFirstRow = true;

                continue;
            }

            if (row instanceof TableSeparator) {
                this._renderRowSeparator();
                continue;
            }

            if (! row) {
                continue;
            }

            if (isFirstRow) {
                this._renderRowSeparator(__self.SEPARATOR_TOP_BOTTOM);
                isFirstRow = false;
            } else if (isHeader) {
                this._renderRowSeparator(__self.SEPARATOR_TOP, this._headerTitle, this._style.headerTitleFormat);
            }

            this._renderRow(row, isHeader ? this._style.cellHeaderFormat : this._style.cellRowFormat);
        }

        this._renderRowSeparator(__self.SEPARATOR_BOTTOM, this._footerTitle, this._style.footerTitleFormat);
        this._cleanup();
    }

    /**
     * Renders horizontal header separator.
     *
     * Example: +-----+-----------+-------+
     *
     * @private
     */
    _renderRowSeparator(type = __self.SEPARATOR_MID, title = null, titleFormat = null) {
        const count = this._numberOfColumns;
        if (0 === count) {
            return;
        }

        const borders = this._style.borderChars;
        if (! borders[0] && ! borders[2] && ! this._style.crossingChar) {
            return;
        }

        const crossings = this._style.crossingChars;
        let horizontal, leftChar, midChar, rightChar;
        if (__self.SEPARATOR_MID === type) {
            [ horizontal, leftChar, midChar, rightChar ] = [ borders[2], crossings[8], crossings[0], crossings[4] ];
        } else if (__self.SEPARATOR_TOP === type) {
            [ horizontal, leftChar, midChar, rightChar ] = [ borders[0], crossings[1], crossings[2], crossings[3] ];
        } else if (__self.SEPARATOR_TOP_BOTTOM === type) {
            [ horizontal, leftChar, midChar, rightChar ] = [ borders[0], crossings[9], crossings[10], crossings[11] ];
        } else {
            [ horizontal, leftChar, midChar, rightChar ] = [ borders[0], crossings[7], crossings[6], crossings[5] ];
        }

        let markup = leftChar;
        for (let column = 0; column < count; ++column) {
            markup += horizontal.repeat(this._effectiveColumnWidths[column]);
            markup += column === count - 1 ? rightChar : midChar;
        }

        if (null !== title) {
            let formattedTitle = __jymfony.sprintf(titleFormat, title);
            let titleLength = Helper.strlenWithoutDecoration(this._output.formatter, formattedTitle);
            const limit = markup.length - 4;
            if (titleLength > limit) {
                titleLength = limit;
                const formatLength = Helper.strlenWithoutDecoration(this._output.formatter, __jymfony.sprintf(titleFormat, ''));
                formattedTitle = __jymfony.sprintf(titleFormat, title.substr(0, limit - formatLength - 3) + '...');
            }

            const titleStart = (markup.length - titleLength) / 2;
            markup = markup.substr(0, titleStart) + formattedTitle + markup.substr(titleStart + titleLength);
        }

        this._output.writeln(__jymfony.sprintf(this._style.borderFormat, markup));
    }

    /**
     * Renders vertical column separator.
     *
     * @private
     */
    _renderColumnSeparator(type = __self.BORDER_OUTSIDE) {
        const borders = this._style.borderChars;

        return __jymfony.sprintf(this._style.borderFormat, __self.BORDER_OUTSIDE === type ? borders[1] : borders[3]);
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
        let rowContent = this._renderColumnSeparator(__self.BORDER_OUTSIDE);
        const columns = this._getRowColumns(row);

        const last = columns.length - 1;
        for (const [ i, column ] of __jymfony.getEntries(columns)) {
            rowContent += this._renderCell(row, column, cellFormat);
            rowContent += this._renderColumnSeparator(last === i ? __self.BORDER_OUTSIDE : __self.BORDER_INSIDE);
        }

        this._output.writeln(rowContent);
    }

    /**
     * Renders table cell with padding.
     *
     * @param {(Jymfony.Component.Console.Helper.TableCell|string)[]} row
     * @param {int} column
     * @param {string} cellFormat
     *
     * @private
     */
    _renderCell(row, column, cellFormat) {
        const cell = undefined !== row[column] ? row[column] : '';
        let width = this._effectiveColumnWidths[column];

        if (cell instanceof TableCell && 1 < cell.colspan) {
            // Add the width of the following columns(numbers of colspan).
            for (let nextColumn = column + 1; nextColumn <= column + cell.colspan - 1; ++nextColumn) {
                width += this._getColumnSeparatorWidth() + this._effectiveColumnWidths[nextColumn];
            }
        }

        const style = this.getColumnStyle(column);
        if (cell instanceof TableSeparator) {
            return __jymfony.sprintf(style.borderFormat, style.borderChars[2].repeat(width));
        }

        width += cell.toString().length - Helper.strlenWithoutDecoration(this._output.formatter, cell);
        const content = __jymfony.sprintf(style.cellRowContentFormat, cell);

        return __jymfony.sprintf(cellFormat, __jymfony.str_pad(content, width, style.paddingChar, style.padType));
    }

    /**
     * Calculate number of columns for this table.
     *
     * @private
     */
    _calculateNumberOfColumns(rows) {
        const columns = [ 0 ];
        for (const row of rows) {
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
            columns += cell instanceof TableCell ? cell.colspan - 1 : 0;
        }

        return columns;
    }

    _buildTableRows(rows) {
        const unmergedRows = {};
        for (let rowKey = 0; rowKey < rows.length; ++rowKey) {
            if (! isArray(rows[rowKey])) {
                continue;
            }

            // Remove any new line breaks and replace it with a new line
            for (let [ column, cell ] of __jymfony.getEntries(rows[rowKey])) {
                const colspan = cell instanceof TableCell ? cell.colspan : 1;
                if (-1 === String(cell).indexOf('\n')) {
                    continue;
                }

                const escaped = String(cell).split('\n').map(OutputFormatter.escapeTrailingBackslash).join('\n');
                cell = cell instanceof TableCell ? new TableCell(escaped, {colspan: cell.colspan}) : escaped;

                const lines = this._output.formatter.format(String(cell).replace(/\n/g, '<fg=default;bg=default>\n</>')).split('\n');
                for (let [ lineKey, line ] of __jymfony.getEntries(lines)) {
                    if (1 < colspan) {
                        line = new TableCell(line, {colspan: colspan});
                    }

                    if (0 === lineKey) {
                        rows[rowKey][column] = line;
                    } else {
                        if (undefined === unmergedRows[rowKey]) {
                            unmergedRows[rowKey] = {};
                        }

                        if (undefined === unmergedRows[rowKey][lineKey]) {
                            unmergedRows[rowKey][lineKey] = {};
                        }

                        unmergedRows[rowKey][lineKey][column] = line;
                    }
                }
            }
        }

        const self = this;

        return new TableRows(function * () {
            for (const [ rowKey, row ] of __jymfony.getEntries(rows)) {
                yield self._fillCells(row);

                if (!! unmergedRows[rowKey]) {
                    for (const row of Object.values(unmergedRows[rowKey])) {
                        yield row;
                    }
                }
            }
        });
    }

    /**
     * Fill cells for a row that contains colspan > 1.
     */
    _fillCells(row) {
        if (! isArray(row)) {
            return row;
        }

        const newRow = [];
        for (const [ column, cell ] of __jymfony.getEntries(row)) {
            newRow.push(cell);
            if (cell instanceof TableCell && 1 < cell.colspan) {
                for (let position = column + 1; position <= column + cell.colspan - 1; ++position) {
                    // Insert empty value at column position
                    newRow.push('');
                }
            }
        }

        return 0 < newRow.length ? newRow : row;
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
        let columns = [ ...Array(this._numberOfColumns).keys() ];
        for (let [ cellKey, cell ] of __jymfony.getEntries(row)) {
            cellKey = ~~cellKey;

            if (cell instanceof TableCell && 1 < cell.colspan) {
                const range = [];
                for (let i = cellKey + 1; i <= cellKey + cell.colspan - 1; ++i) {
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
        const effectiveRows = [];
        for (let row of rows) {
            if (row instanceof TableSeparator) {
                effectiveRows.push(row);
                continue;
            }

            row = isArray(row) ? [ ...row ] : { ...row };
            for (const [ i, cell ] of __jymfony.getEntries(row)) {
                if (cell instanceof TableCell) {
                    const textContent = Helper.removeDecoration(this._output.formatter, cell);
                    const textLength = textContent.length;

                    if (0 < textLength) {
                        const contentColumns = [];
                        const step = Math.ceil(textLength / cell.colspan);
                        for (let counter = 0; counter < textLength; counter += step) {
                            contentColumns.push(textContent.substr(counter, step));
                        }

                        for (const [ position, content ] of __jymfony.getEntries(contentColumns)) {
                            row[i + position] = content;
                        }
                    }
                }
            }

            effectiveRows.push(row);
        }

        for (let column = 0; column < this._numberOfColumns; ++column) {
            const lengths = [];

            for (const row of effectiveRows) {
                if (row instanceof TableSeparator) {
                    continue;
                }

                lengths.push(this._getCellWidth(row, column));
            }

            this._effectiveColumnWidths[column] = Math.max(...lengths) + this._style.cellRowContentFormat.length - 2;
        }
    }

    /**
     * @returns {int}
     *
     * @private
     */
    _getColumnSeparatorWidth() {
        return __jymfony.sprintf(this._style.borderFormat, this._style.borderChars[3]).length;
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

        if (!! styles[name]) {
            return styles[name];
        }

        throw new InvalidArgumentException(__jymfony.sprintf('Style "%s" is not defined.', name));
    }
}

Table.SEPARATOR_TOP = 0;
Table.SEPARATOR_TOP_BOTTOM = 1;
Table.SEPARATOR_MID = 2;
Table.SEPARATOR_BOTTOM = 3;
Table.BORDER_OUTSIDE = 0;
Table.BORDER_INSIDE = 1;
