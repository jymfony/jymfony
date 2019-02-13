const DoubleException = Jymfony.Component.Testing.Exception.DoubleException;

/**
 * @memberOf Jymfony.Component.Testing.Exception
 */
class MethodNotFoundException extends DoubleException {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {string} className
     * @param {string} methodName
     * @param {Array} [args]
     */
    __construct(message, className, methodName, args = []) {
        super.__construct(message);

        /**
         * @type {string}
         *
         * @private
         */
        this._className = className;

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
    }

    /**
     * @returns {string}
     */
    get className() {
        return this._className;
    }

    /**
     * @returns {string}
     */
    get methodName() {
        return this._methodName;
    }

    /**
     * @returns {*[]}
     */
    get args() {
        return this._args;
    }
}

module.exports = MethodNotFoundException;
