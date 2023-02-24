declare namespace Jymfony.Component.Messenger.Exception {
    export class ValidationFailedException extends RuntimeException {
        private _violatingMessage: object;
        private _violations: unknown;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(violatingMessage: object, violations: unknown): void;
        constructor(violatingMessage: object, violations: unknown);

        get violatingMessage(): object;

        get violations(): unknown;
    }
}
