declare namespace Jymfony.Component.Messenger.Stamp {
    import FlattenExceptionInterface = Jymfony.Contracts.Debug.Exception.FlattenExceptionInterface;

    /**
     * Stamp applied when a messages fails due to an exception in the handler.
     *
     * @final
     */
    export class ErrorDetailsStamp extends implementationOf(StampInterface) {
        private _exceptionClass: string;
        private _exceptionCode: number | string;
        private _exceptionMessage: string;
        private _flattenException: FlattenExceptionInterface | null;

        /**
         * Constructor.
         */
        __construct(exceptionClass: string, exceptionCode: number | string, exceptionMessage: string, flattenException?: FlattenExceptionInterface | null): void;
        constructor(exceptionClass: string, exceptionCode: number | string, exceptionMessage: string, flattenException?: FlattenExceptionInterface | null);

        /**
         * @param {Error} throwable
         *
         * @returns {Jymfony.Component.Messenger.Stamp.ErrorDetailsStamp}
         */
        static create(throwable: Error): ErrorDetailsStamp;

        public readonly exceptionClass: string;

        public readonly exceptionCode: number | string;

        public readonly exceptionMessage: string;

        public readonly flattenException: FlattenExceptionInterface | null;

        equals(that: ErrorDetailsStamp): boolean;
    }
}
