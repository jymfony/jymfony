declare namespace Jymfony.Component.Dotenv.Exception {
    /**
     * Thrown when a file has a syntax error.
     */
    export class FormatException extends mix(LogicException, ExceptionInterface) {
        private _context: Jymfony.Component.Dotenv.Exception.FormatExceptionContext;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, context: Jymfony.Component.Dotenv.Exception.FormatExceptionContext, code?: number, previous?: Error | null): void;
        constructor(message: string, context: Jymfony.Component.Dotenv.Exception.FormatExceptionContext, code?: number, previous?: Error | null);

        /**
         * @returns {Jymfony.Component.Dotenv.Exception.FormatExceptionContext}
         */
        public readonly context: Jymfony.Component.Dotenv.Exception.FormatExceptionContext;
    }
}
