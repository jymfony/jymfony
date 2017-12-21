/**
 * @memberOf Jymfony.Component.Console.Helper
 */
class TableStyle {
    __construct() {
        /**
         * @type {string}
         *
         * @private
         */
        this._paddingChar = ' ';

        /**
         * @type {string}
         *
         * @private
         */
        this._horizontalBorderChar = '-';

        /**
         * @type {string}
         *
         * @private
         */
        this._verticalBorderChar = '|';

        /**
         * @type {string}
         *
         * @private
         */
        this._crossingChar = '+';

        /**
         * @type {string}
         *
         * @private
         */
        this._cellHeaderFormat = '<info>%s</info>';

        /**
         * @type {string}
         *
         * @private
         */
        this._cellRowFormat = '%s';

        /**
         * @type {string}
         *
         * @private
         */
        this._cellRowContentFormat = ' %s ';

        /**
         * @type {string}
         *
         * @private
         */
        this._borderFormat = '%s';

        this._padType = __jymfony.str_pad.RIGHT;
    }

    /**
     * Gets padding character, used for cell padding.
     *
     * @returns {string}
     */
    getPaddingChar() {
        return this._paddingChar;
    }

    /**
     * Sets padding character, used for cell padding.
     *
     * @param {string} paddingChar
     *
     * @return {TableStyle}
     */
    setPaddingChar(paddingChar) {
        if (!paddingChar) {
            throw new LogicException('The padding char must not be empty');
        }

        this._paddingChar = paddingChar;

        return this;
    }

    /**
     * Gets horizontal border character.
     *
     * @return {string}
     */
    getHorizontalBorderChar() {
        return this._horizontalBorderChar;
    }

    /**
     * Sets horizontal border character.
     *
     * @param {string} horizontalBorderChar
     *
     * @return {TableStyle}
     */
    setHorizontalBorderChar(horizontalBorderChar) {
        this._horizontalBorderChar = horizontalBorderChar;

        return this;
    }

    /**
     * Gets vertical border character.
     *
     * @returns {string}
     */
    getVerticalBorderChar() {
        return this._verticalBorderChar;
    }

    /**
     * Sets vertical border character.
     *
     * @param {string} verticalBorderChar
     *
     * @return {TableStyle}
     */
    setVerticalBorderChar(verticalBorderChar) {
        this._verticalBorderChar = verticalBorderChar;

        return this;
    }

    /**
     * Gets crossing character.
     *
     * @return {string}
     */
    getCrossingChar() {
        return this._crossingChar;
    }

    /**
     * Sets crossing character.
     *
     * @param {string} crossingChar
     *
     * @return {TableStyle}
     */
    setCrossingChar(crossingChar) {
        this._crossingChar = crossingChar;

        return this;
    }

    /**
     * Gets header cell format.
     *
     * @return {string}
     */
    getCellHeaderFormat() {
        return this._cellHeaderFormat;
    }

    /**
     * Sets header cell format.
     *
     * @param {string} cellHeaderFormat
     *
     * @return {TableStyle}
     */
    setCellHeaderFormat(cellHeaderFormat) {
        this._cellHeaderFormat = cellHeaderFormat;

        return this;
    }

    /**
     * Gets row cell format.
     *
     * @return {string}
     */
    getCellRowFormat() {
        return this._cellRowFormat;
    }

    /**
     * Sets row cell format.
     *
     * @param {string} cellRowFormat
     *
     * @return {TableStyle}
     */
    setCellRowFormat(cellRowFormat) {
        this._cellRowFormat = cellRowFormat;

        return this;
    }

    /**
     * Gets row cell content format.
     *
     * @return {string}
     */
    getCellRowContentFormat() {
        return this._cellRowContentFormat;
    }

    /**
     * Sets row cell content format.
     *
     * @param {string} cellRowContentFormat
     *
     * @return {TableStyle}
     */
    setCellRowContentFormat(cellRowContentFormat) {
        this._cellRowContentFormat = cellRowContentFormat;

        return this;
    }

    /**
     * Gets table border format.
     *
     * @return {string}
     */
    getBorderFormat() {
        return this._borderFormat;
    }

    /**
     * Sets table border format.
     *
     * @param {string} borderFormat
     *
     * @return {TableStyle}
     */
    setBorderFormat(borderFormat) {
        this._borderFormat = borderFormat;

        return this;
    }

    /**
     * Gets cell padding type.
     *
     * @return {string}
     */
    getPadType() {
        return this._padType;
    }

    /**
     * Sets cell padding type.
     *
     * @param {string} padType
     *
     * @return {TableStyle}
     */
    setPadType(padType) {
        this._padType = padType;

        return this;
    }
}
module.exports = TableStyle;
