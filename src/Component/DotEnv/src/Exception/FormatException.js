const ExceptionInterface = Jymfony.Component.Dotenv.Exception.ExceptionInterface;

/**
 * Thrown when a file has a syntax error.
 *
 * @memberOf Jymfony.Component.Dotenv.Exception
 */
export default class FormatException extends mix(LogicException, ExceptionInterface) {
    /**
     * Constructor.
     *
     * @param {string} message
     * @param {Jymfony.Component.Dotenv.Exception.FormatExceptionContext} context
     * @param {int} [code = 0]
     * @param {Error} [previous = null]
     */
    __construct(message, context, code = 0, previous = null) {
        /**
         * @type {Jymfony.Component.Dotenv.Exception.FormatExceptionContext}
         *
         * @private
         */
        this._context = context;

        super.__construct(__jymfony.sprintf('%s in "%s" at line %d.\n%s', message, context.path, context.lineNo, context.details), code, previous);
    }

    /**
     * @returns {Jymfony.Component.Dotenv.Exception.FormatExceptionContext}
     */
    get context() {
        return this._context;
    }
}
