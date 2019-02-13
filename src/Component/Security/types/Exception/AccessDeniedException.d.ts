declare namespace Jymfony.Component.Security.Exception {
    /**
     * Represents an exception thrown on authorization (ie: the user has not the required roles).
     */
    export class AccessDeniedException extends RuntimeException {
        public attributes: any[];
        public subject: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message?: string, previous?: Error): void;
        constructor(message?: string, previous?: Error);
    }
}
