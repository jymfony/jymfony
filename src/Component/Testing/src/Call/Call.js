const StringUtil = Jymfony.Component.Testing.Util.StringUtil;

/**
 * @memberOf Jymfony.Component.Testing.Call
 */
export default class Call {
    /**
     * Constructor.
     *
     * @param {string} methodName
     * @param {*[]} args
     * @param {*} returnValue
     * @param {Error} exception
     * @param {string} file
     * @param {int} line
     */
    __construct(methodName, args, returnValue, exception, file, line) {
        /**
         * @type {string}
         *
         * @private
         */
        this._methodName = methodName;

        /**
         * @type {*[]}
         *
         * @private
         */
        this._args = args;

        /**
         * @type {*}
         *
         * @private
         */
        this._returnValue = returnValue;

        /**
         * @type {Error}
         *
         * @private
         */
        this._exception = exception;

        /**
         * @type {string}
         *
         * @private
         */
        this._file = file;

        /**
         * @type {int}
         *
         * @private
         */
        this._line = ~~line;
    }

    /**
     * Gets the called method name.
     *
     * @returns {string}
     */
    get methodName() {
        return this._methodName;
    }

    /**
     * Gets the passed arguments.
     *
     * @returns {*[]}
     */
    get args() {
        return [ ...this._args ];
    }

    /**
     * Gets the returned value.
     *
     * @returns {*}
     */
    get returnValue() {
        return this._returnValue;
    }

    /**
     * Gets the thrown exception.
     *
     * @returns {Error}
     */
    get exception() {
        return this._exception;
    }

    /**
     * Gets the callee filename.
     *
     * @returns {string}
     */
    get file() {
        return this._file;
    }

    /**
     * Gets the callee line number.
     *
     * @returns {int}
     */
    get line() {
        return this._line;
    }

    /**
     * Returns short notation for callee place.
     *
     * @returns {string}
     */
    get callPlace() {
        if (! this._file) {
            return 'unknown';
        }

        return this._file + ':' + this._line;
    }

    /**
     * @returns {string}
     */
    toString() {
        return __jymfony.sprintf('  - %s(%s) @ %s',
            this._methodName,
            this._args.map(StringUtil.stringify).join(', '),
            this.callPlace
        );
    }
}
