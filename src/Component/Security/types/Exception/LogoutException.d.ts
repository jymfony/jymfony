declare namespace Jymfony.Component.Security.Exception {
    /**
     * LogoutException is thrown when the account cannot be logged out.
     */
    export class LogoutException extends RuntimeException {
        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message?: string, previous?: Error): void;
        constructor(message?: string, previous?: Error);
    }
}
