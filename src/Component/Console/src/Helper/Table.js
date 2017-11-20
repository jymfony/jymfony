const OutputInterface = Jymfony.Component.Console.Output.OutputInterface;
const InvalidArgumentException = Jymfony.Component.Console.Exception.InvalidArgumentException;

class Table {
    /**
     * @param {OutputInterface} output An OutputInterface instance
     * @private
     */
    __construct(output) {
        /**
         * Table headers.
         *
         * @type {Object}
         * @private
         */
        this._headers = {};

        /**
         * Table rows.
         *
         * @type {Object}
         * @private
         */
        this._rows = {};

        /**
         * Column widths cache.
         *
         * @type {Object}
         * @private
         */
        this._effectiveColumnWidths = {};

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

        if (!this.styles) {
            Table.styles = Table.initStyles();
        }

        this.style = 'default';
    }

    static get styles() {
        return Table.styles;
    }

    static set styles(styles) {
        Table.styles = styles || {};
    }

    /**
     * Sets a style definition.
     *
     * @param {string} name The style name
     * @param {TableStyle} style A TableStyle instance
     */
    static setStyleDefinition(name, style) {
        if (!Table.styles) {
            Table.styles = Table.initStyles();
        }

        Table.styles[$name] = style;
    }


    /**
     * Gets a style definition by name.
     *
     * @param {string} name The style name
     *
     * @return TableStyle
     */
    static getStyleDefinition(name) {
        if (!Table.styles) {
            Table.styles = Table.initStyles();
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
     *
     * @return {Table}
     */
    set style(name) {
        this._style = this.resolveStyle(name);

        return this;
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
        this._columnStyles[columnIndex] = this.resolveStyle(name);

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
}
