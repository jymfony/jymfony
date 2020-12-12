const AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;

/**
 * @memberOf Jymfony.Component.Testing.Framework.Exception
 */
export default class SyntheticException extends AssertionFailedException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {int|null} code
     * @param {string} file
     * @param {int} line
     * @param {*[]}trace
     */
    __construct(message, code, file, line, trace) {
        super.__construct(message, code);

        /**
         * @type {string}
         *
         * @protected
         */
        this._syntheticFile = file;

        /**
         * @type {int}
         *
         * @protected
         */
        this._syntheticLine = line;

        /**
         * @type {*[]}
         *
         * @protected
         */
        this._syntheticTrace = trace;
    }

    get syntheticFile() {
        return this._syntheticFile;
    }

    get syntheticLine() {
        return this._syntheticLine;
    }

    get syntheticTrace() {
        return this._syntheticTrace;
    }

    get stackTrace() {
        return this.syntheticTrace;
    }
}
