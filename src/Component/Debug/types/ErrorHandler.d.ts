declare namespace Jymfony.Component.Debug {
    import LoggerInterface = Jymfony.Component.Logger.LoggerInterface;

    export class ErrorHandler {
        private _bootstrappingLogger: BufferingLogger;
        private _defaultLogger: LoggerInterface;
        private _debug: boolean;
        private _isRecursive: boolean;
        private _exceptionHandler: Function;

        /**
         * Constructor.
         */
        __construct(bootstrappingLogger?: BufferingLogger, debug?: boolean): void;
        constructor(bootstrappingLogger?: BufferingLogger, debug?: boolean);

        /**
         * Registers the error handler.
         */
        static register(handler?: ErrorHandler): ErrorHandler;

        /**
         * Sets the default logger.
         */
        setDefaultLogger(logger: LoggerInterface): LoggerInterface;

        /**
         * Handles errors.
         *
         * @internal
         */
        handleError(args: { name: string, message: string, stack: string }): void;

        /**
         * Handles an exception by logging it.
         *
         * @internal
         */
        handleException(exception: Error): void;

        /**
         * Override this method if you want to define more error enhancers.
         *
         * @returns {Jymfony.Component.Debug.ErrorEnhancer.ErrorEnhancerInterface[]}
         */
        public readonly _errorEnhancers: ErrorEnhancerInterface[];

        /**
         * Renders the given exception.
         */
        private _renderException(exception: Error): void;
    }
}
