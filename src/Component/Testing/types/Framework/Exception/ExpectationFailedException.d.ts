declare namespace Jymfony.Component.Testing.Framework.Exception {
    import AssertionFailedException = Jymfony.Component.Testing.Framework.Exception.AssertionFailedException;
    import ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;

    /**
     * Exception for expectations which failed their check.
     *
     * The exception contains the error message and optionally a
     * ComparisonFailure which is used to generate diff output of the failed expectations.
     */
    export class ExpectationFailedException extends AssertionFailedException {
        private _comparisonFailure: ComparisonFailure;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(message: string, comparisonFailure?: null | ComparisonFailure, previous?: Error): void;
        constructor(message: string, comparisonFailure?: null | ComparisonFailure, previous?: Error);

        /**
         * Returns the comparison failed actual value.
         * It is currently requested by mocha.
         */
        readonly actual: any;

        /**
         * Returns the comparison failed expected value.
         * It is currently requested by mocha.
         */
        readonly expected: any;

        readonly comparisonFailure: ComparisonFailure;
    }
}
