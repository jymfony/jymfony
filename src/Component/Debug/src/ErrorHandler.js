const CliErrorRenderer = Jymfony.Component.Debug.ErrorRenderer.CliErrorRenderer;
const ErrorException = Jymfony.Component.Debug.Exception.ErrorException;
const LogLevel = Jymfony.Contracts.Logger.LogLevel;

/**
 * @memberOf Jymfony.Component.Debug
 */
export default class ErrorHandler {
    /**
     * Constructor.
     *
     * @param {Jymfony.Component.Debug.BufferingLogger} bootstrappingLogger
     * @param {boolean} debug
     */
    __construct(bootstrappingLogger = null, debug = false) {
        /**
         * @type {Jymfony.Component.Debug.BufferingLogger}
         *
         * @private
         */
        this._bootstrappingLogger = bootstrappingLogger;
        if (bootstrappingLogger) {
            process.on('beforeExit', () => this._bootstrappingLogger.finalize());
        }

        /**
         * @type {Jymfony.Contracts.Logger.LoggerInterface}
         *
         * @private
         */
        this._defaultLogger = bootstrappingLogger;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._debug = debug;

        /**
         * @type {boolean}
         *
         * @private
         */
        this._isRecursive = false;

        /**
         * @type {Function}
         *
         * @private
         */
        this._exceptionHandler = null;
    }

    /**
     * Registers the error handler.
     *
     * @param {Jymfony.Component.Debug.ErrorHandler} handler
     *
     * @returns {Jymfony.Component.Debug.ErrorHandler}
     */
    static register(handler = null) {
        const handlerIsNew = ! handler;
        if (handlerIsNew) {
            handler = new __self();
        }

        process.prependListener('warning', new BoundFunction(handler, handler.handleError));
        process.prependListener('uncaughtException', new BoundFunction(handler, handler.handleException));

        return handler;
    }

    /**
     * Sets the default logger.
     *
     * @param {Jymfony.Contracts.Logger.LoggerInterface} logger
     *
     * @returns {Jymfony.Contracts.Logger.LoggerInterface}
     */
    setDefaultLogger(logger) {
        const previousLogger = this._defaultLogger;
        this._defaultLogger = logger;

        return previousLogger;
    }

    /**
     * Handles errors.
     *
     * @internal
     */
    handleError({ name: type, message, stack }) {
        const errorAsException = new ErrorException(message, 0, type);
        errorAsException._originalStack = stack.split('\n').join('\n');
        errorAsException._updateStack();

        let level = LogLevel.ERROR;
        if ('DeprecationWarning' === type) {
            level = LogLevel.DEBUG;
        } else {
            throw errorAsException;
        }

        if (! this._isRecursive) {
            try {
                this._isRecursive = true;
                this._defaultLogger.log(level, message, { exception: errorAsException });
            } finally {
                this._isRecursive = false;
            }
        }
    }

    /**
     * Handles an exception by logging it.
     *
     * @internal
     *
     * @param {Error} exception
     */
    handleException(exception) {
        let handlerException = null;
        process.exitCode = 255;

        let message = exception.message;
        if (message instanceof ErrorException) {
            message = 'Uncaught ' + message;
        } else if (message instanceof Exception) {
            message = 'Uncaught Exception: ' + message;
        } else {
            message = 'Uncaught Error: ' + message;
        }

        if (this._defaultLogger) {
            try {
                this._defaultLogger.log(LogLevel.ERROR, message, { exception });
            } catch (e) {
                handlerException = e;
            }
        }

        for (const errorEnhancer of this._errorEnhancers) {
            const e = errorEnhancer.enhance(exception);
            if (!! e) {
                exception = e;
                break;
            }
        }

        const exceptionHandler = this._exceptionHandler;
        this._exceptionHandler = new BoundFunction(this, this._renderException);

        if (! exceptionHandler || this._exceptionHandler.equals(exceptionHandler)) {
            this._exceptionHandler = null;
        }

        try {
            if (!! exceptionHandler) {
                return exceptionHandler(exception);
            }

            handlerException = handlerException || exception;
        } catch (e) {
            handlerException = e;
        }

        if (exception === handlerException && ! this._exceptionHandler) {
            return;
        }

        this.handleException(handlerException);
    }

    /**
     * Override this method if you want to define more error enhancers.
     *
     * @returns {Jymfony.Contracts.Debug.ErrorEnhancer.ErrorEnhancerInterface[]}
     */
    get _errorEnhancers() {
        return [ ];
    }

    /**
     * Renders the given exception.
     *
     * @private
     */
    _renderException(exception) {
        const renderer = new CliErrorRenderer();
        exception = renderer.render(exception);

        process.stdout.write(exception.asString);
    }
}
