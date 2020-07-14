declare namespace Jymfony.Component.Dotenv.Exception {
    /**
     * Thrown when a file does not exist or is not readable.
     */
    class PathException extends mix(RuntimeException, ExceptionInterface) {
        /**
         * Constructor.
         */
        __construct(path: string, code?: number, previous?: Error | null): void;
        constructor(path: string, code?: number, previous?: Error | null);
    }
}
