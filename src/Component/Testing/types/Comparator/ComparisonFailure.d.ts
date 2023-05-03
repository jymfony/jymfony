declare namespace Jymfony.Component.Testing.Comparator {
    /**
     * Thrown when an assertion for string equality failed.
     */
    export class ComparisonFailure extends global.RuntimeException {
        protected _expected: any;
        protected _actual: any;
        protected _expectedAsString: string;
        protected _actualAsString: string;
        protected _identical: boolean;
        protected _message: string;

        /**
         * Initialises with the expected value and the actual value.
         */
        // @ts-ignore
        __construct(expected: any, actual: any, expectedAsString: string, actualAsString: string, identical?: boolean, message?: string): void;
        constructor(expected: any, actual: any, expectedAsString: string, actualAsString: string, identical?: boolean, message?: string);

        readonly actual: any;
        readonly expected: any;

        readonly actualAsString: string;
        readonly expectedAsString: string;
        readonly diff: string;

        toString(): string;
    }
}
