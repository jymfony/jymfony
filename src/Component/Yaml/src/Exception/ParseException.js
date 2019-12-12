const RuntimeException = Jymfony.Component.Yaml.Exception.RuntimeException;

/**
 * Exception class thrown when an error occurs during parsing.
 *
 * @memberOf Jymfony.Component.Yaml.Exception
 */
export default class ParseException extends RuntimeException {
    /**
     * Constructor.
     *
     * @param {string} message The error message
     * @param {int} [parsedLine = -1] The line where the error occurred
     * @param {string|null} [snippet] The snippet of code near the problem
     * @param {string|null} [parsedFile] The file name where the error occurred
     * @param {Error} [previous] The previous exception
     */
    __construct(message, parsedLine = -1, snippet = undefined, parsedFile = undefined, previous = undefined) {
        /**
         * @type {string}
         *
         * @private
         */
        this._parsedFile = parsedFile;

        /**
         * @type {int}
         *
         * @private
         */
        this._parsedLine = parsedLine;

        /**
         * @type {string}
         *
         * @private
         */
        this._snippet = snippet;

        /**
         * @type {string}
         *
         * @private
         */
        this._rawMessage = message;

        /**
         * @type {string}
         *
         * @private
         */
        this._message = null;

        this._updateRepr();

        super.__construct(this._message, 0, previous);
    }

    /**
     * Gets the snippet of code near the error.
     *
     * @returns {string} The snippet of code
     */
    get snippet() {
        return this._snippet;
    }

    /**
     * Sets the snippet of code near the error.
     *
     * @param {string} snippet The code snippet
     */
    set snippet(snippet) {
        this._snippet = snippet;

        this._updateRepr();
    }

    /**
     * Gets the filename where the error occurred.
     *
     * This method returns null if a string is parsed.
     *
     * @returns {string} The filename
     */
    get parsedFile() {
        return this._parsedFile;
    }

    /**
     * Sets the filename where the error occurred.
     *
     * @param {string} parsedFile The filename
     */
    set parsedFile(parsedFile) {
        this._parsedFile = parsedFile;

        this._updateRepr();
    }

    /**
     * Gets the line where the error occurred.
     *
     * @returns {int} The file line
     */
    get parsedLine() {
        return this._parsedLine;
    }

    /**
     * Sets the line where the error occurred.
     *
     * @param {int} parsedLine The file line
     */
    set parsedLine(parsedLine) {
        this._parsedLine = parsedLine;

        this._updateRepr();
    }

    _updateRepr() {
        this._message = this._rawMessage;

        let dot = false;
        if ('.' === this._message.substr(-1)) {
            this._message = this._message.substr(0, this._message.length - 1);
            dot = true;
        }

        if (!! this._parsedFile) {
            this._message += __jymfony.sprintf(' in %s', JSON.stringify(this._parsedFile));
        }

        if (0 <= this._parsedLine) {
            this._message += __jymfony.sprintf(' at line %d', this._parsedLine);
        }

        if (this._snippet) {
            this._message += __jymfony.sprintf(' (near "%s")', this._snippet);
        }

        if (dot) {
            this._message += '.';
        }
    }
}
