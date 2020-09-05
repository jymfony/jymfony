/**
 * Defines the styles for a Table.
 *
 * @memberOf Jymfony.Component.Console.Helper
 */
export default class TableStyle {
    __construct() {
        this._paddingChar = ' ';
        this._horizontalOutsideBorderChar = '-';
        this._horizontalInsideBorderChar = '-';
        this._verticalOutsideBorderChar = '|';
        this._verticalInsideBorderChar = '|';
        this._crossingChar = '+';
        this._crossingTopRightChar = '+';
        this._crossingTopMidChar = '+';
        this._crossingTopLeftChar = '+';
        this._crossingMidRightChar = '+';
        this._crossingBottomRightChar = '+';
        this._crossingBottomMidChar = '+';
        this._crossingBottomLeftChar = '+';
        this._crossingMidLeftChar = '+';
        this._crossingTopLeftBottomChar = '+';
        this._crossingTopMidBottomChar = '+';
        this._crossingTopRightBottomChar = '+';
        this._headerTitleFormat = '<fg=black;bg=white;options=bold> %s </>';
        this._footerTitleFormat = '<fg=black;bg=white;options=bold> %s </>';
        this._cellHeaderFormat = '<info>%s</info>';
        this._cellRowFormat = '%s';
        this._cellRowContentFormat = ' %s ';
        this._borderFormat = '%s';
        this._padType = __jymfony.STR_PAD_RIGHT;
    }

    /**
     * Sets padding character, used for cell padding.
     *
     * @param {string} paddingChar
     */
    set paddingChar(paddingChar) {
        if (! paddingChar) {
            throw new LogicException('The padding char must not be empty');
        }

        this._paddingChar = paddingChar;
    }

    /**
     * Gets padding character, used for cell padding.
     *
     * @returns {string}
     */
    get paddingChar() {
        return this._paddingChar;
    }

    /**
     * Sets horizontal border characters.
     *
     * <code>
     * ╔═══════════════╤══════════════════════════╤══════════════════╗
     * 1 ISBN          2 Title                    │ Author           ║
     * ╠═══════════════╪══════════════════════════╪══════════════════╣
     * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
     * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
     * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
     * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
     * ╚═══════════════╧══════════════════════════╧══════════════════╝
     * </code>
     *
     * @param {string}      outside Outside border char (see #1 of example)
     * @param {null|string} inside  Inside border char (see #2 of example), equals outside if null
     */
    setHorizontalBorderChars(outside, inside = null) {
        this._horizontalOutsideBorderChar = outside;
        this._horizontalInsideBorderChar = inside || outside;
    }

    /**
     * Sets vertical border characters.
     *
     * <code>
     * ╔═══════════════╤══════════════════════════╤══════════════════╗
     * ║ ISBN          │ Title                    │ Author           ║
     * ╠═══════1═══════╪══════════════════════════╪══════════════════╣
     * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
     * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
     * ╟───────2───────┼──────────────────────────┼──────────────────╢
     * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
     * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
     * ╚═══════════════╧══════════════════════════╧══════════════════╝
     * </code>
     *
     * @param {string}      outside Outside border char (see #1 of example)
     * @param {null|string} inside  Inside border char (see #2 of example), equals outside if null
     */
    setVerticalBorderChars(outside, inside = null) {
        this._verticalOutsideBorderChar = outside;
        this._verticalInsideBorderChar = inside || outside;
    }

    /**
     * Gets border characters.
     *
     * @internal
     */
    get borderChars() {
        return [
            this._horizontalOutsideBorderChar,
            this._verticalOutsideBorderChar,
            this._horizontalInsideBorderChar,
            this._verticalInsideBorderChar,
        ];
    }

    /**
     * Sets crossing characters.
     *
     * Example:
     * <code>
     * 1═══════════════2══════════════════════════2══════════════════3
     * ║ ISBN          │ Title                    │ Author           ║
     * 8'══════════════0'═════════════════════════0'═════════════════4'
     * ║ 99921-58-10-7 │ Divine Comedy            │ Dante Alighieri  ║
     * ║ 9971-5-0210-0 │ A Tale of Two Cities     │ Charles Dickens  ║
     * 8───────────────0──────────────────────────0──────────────────4
     * ║ 960-425-059-0 │ The Lord of the Rings    │ J. R. R. Tolkien ║
     * ║ 80-902734-1-6 │ And Then There Were None │ Agatha Christie  ║
     * 7═══════════════6══════════════════════════6══════════════════5
     * </code>
     *
     * @param {string}      cross          Crossing char (see #0 of example)
     * @param {string}      topLeft        Top left char (see #1 of example)
     * @param {string}      topMid         Top mid char (see #2 of example)
     * @param {string}      topRight       Top right char (see #3 of example)
     * @param {string}      midRight       Mid right char (see #4 of example)
     * @param {string}      bottomRight    Bottom right char (see #5 of example)
     * @param {string}      bottomMid      Bottom mid char (see #6 of example)
     * @param {string}      bottomLeft     Bottom left char (see #7 of example)
     * @param {string}      midLeft        Mid left char (see #8 of example)
     * @param {null|string} topLeftBottom  Top left bottom char (see #8' of example), equals to midLeft if null
     * @param {null|string} topMidBottom   Top mid bottom char (see #0' of example), equals to cross if null
     * @param {null|string} topRightBottom Top right bottom char (see #4' of example), equals to midRight if null
     */
    setCrossingChars(cross, topLeft, topMid, topRight, midRight, bottomRight, bottomMid, bottomLeft, midLeft, topLeftBottom = null, topMidBottom = null, topRightBottom = null) {
        this._crossingChar = cross;
        this._crossingTopLeftChar = topLeft;
        this._crossingTopMidChar = topMid;
        this._crossingTopRightChar = topRight;
        this._crossingMidRightChar = midRight;
        this._crossingBottomRightChar = bottomRight;
        this._crossingBottomMidChar = bottomMid;
        this._crossingBottomLeftChar = bottomLeft;
        this._crossingMidLeftChar = midLeft;
        this._crossingTopLeftBottomChar = topLeftBottom || midLeft;
        this._crossingTopMidBottomChar = topMidBottom || cross;
        this._crossingTopRightBottomChar = topRightBottom || midRight;
    }

    /**
     * Sets default crossing character used for each cross.
     *
     * @see {@link setCrossingChars()} for setting each crossing individually.
     */
    set defaultCrossingChar(char) {
        return this.setCrossingChars(char, char, char, char, char, char, char, char, char);
    }

    /**
     * Gets crossing character.
     *
     * @returns {string}
     */
    get crossingChar() {
        return this._crossingChar;
    }

    /**
     * Gets crossing characters.
     *
     * @internal
     */
    get crossingChars() {
        return [
            this._crossingChar,
            this._crossingTopLeftChar,
            this._crossingTopMidChar,
            this._crossingTopRightChar,
            this._crossingMidRightChar,
            this._crossingBottomRightChar,
            this._crossingBottomMidChar,
            this._crossingBottomLeftChar,
            this._crossingMidLeftChar,
            this._crossingTopLeftBottomChar,
            this._crossingTopMidBottomChar,
            this._crossingTopRightBottomChar,
        ];
    }

    /**
     * Sets header cell format.
     *
     * @param {string} cellHeaderFormat
     */
    set cellHeaderFormat(cellHeaderFormat) {
        this._cellHeaderFormat = cellHeaderFormat;
    }

    /**
     * Gets header cell format.
     *
     * @returns {string}
     */
    get cellHeaderFormat() {
        return this._cellHeaderFormat;
    }

    /**
     * Sets row cell format.
     *
     * @param {string} cellRowFormat
     */
    set cellRowFormat(cellRowFormat) {
        this._cellRowFormat = cellRowFormat;
    }

    /**
     * Gets row cell format.
     *
     * @returns {string}
     */
    get cellRowFormat() {
        return this._cellRowFormat;
    }

    /**
     * Sets row cell content format.
     *
     * @param {string} cellRowContentFormat
     */
    set cellRowContentFormat(cellRowContentFormat) {
        this._cellRowContentFormat = cellRowContentFormat;
    }

    /**
     * Gets row cell content format.
     *
     * @returns {string}
     */
    get cellRowContentFormat() {
        return this._cellRowContentFormat;
    }

    /**
     * Sets table border format.
     *
     * @param {string} borderFormat
     */
    set borderFormat(borderFormat) {
        this._borderFormat = borderFormat;
    }

    /**
     * Gets table border format.
     *
     * @returns {string}
     */
    get borderFormat() {
        return this._borderFormat;
    }

    /**
     * Sets cell padding type.
     *
     * @param {string} padType STR_PAD_*
     */
    set padType(padType) {
        if (__jymfony.STR_PAD_LEFT !== padType && __jymfony.STR_PAD_RIGHT !== padType && __jymfony.STR_PAD_BOTH !== padType) {
            throw new InvalidArgumentException('Invalid padding type. Expected one of (PAD_LEFT, PAD_RIGHT, PAD_BOTH).');
        }

        this._padType = padType;
    }

    /**
     * Gets cell padding type.
     *
     * @returns {string}
     */
    get padType() {
        return this._padType;
    }

    get headerTitleFormat() {
        return this._headerTitleFormat;
    }

    set headerTitleFormat(format) {
        this._headerTitleFormat = format;
    }

    get footerTitleFormat() {
        return this._footerTitleFormat;
    }

    set footerTitleFormat(format) {
        this._footerTitleFormat = format;
    }
}
