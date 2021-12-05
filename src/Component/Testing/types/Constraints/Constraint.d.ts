declare namespace Jymfony.Component.Testing.Constraints {
    import ComparisonFailure = Jymfony.Component.Testing.Comparator.ComparisonFailure;
    import ExporterTrait = Jymfony.Component.Testing.ExporterTrait;

    /**
     * Abstract base class for constraints which can be applied to any value.
     */
    export abstract class Constraint extends implementationOf(ExporterTrait) {
        /**
         * Evaluates the constraint for parameter other
         *
         * If Throw is set to true (the default), an exception is thrown
         * in case of a failure. null is returned otherwise.
         *
         * If Throw is false, the result of the evaluation is returned as
         * a boolean value instead: true in case of success, false in case of a
         * failure.
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         */
        evaluate(other: any, description?: string, Throw?: boolean): boolean;

        /**
         * Counts the number of constraint elements.
         */
        readonly length: number;

        /**
         * Evaluates the constraint for parameter other. Returns true if the
         * constraint is met, false otherwise.
         *
         * This method can be overridden to implement the evaluation algorithm.
         *
         * @param other value or object to evaluate
         */
        protected matches(other: any): boolean;

        /**
         * Throws an exception for the given compared value and test description
         *
         * @throws {Jymfony.Component.Testing.Framework.Exception.ExpectationFailedException}
         *
         * @protected
         */
        protected fail(other: any, description: string, comparisonFailure?: null | ComparisonFailure): never;

        /**
         * Return additional failure description where needed
         *
         * The function can be overridden to provide additional failure
         * information like a diff
         *
         * @param other evaluated value or object
         */
        protected _additionalFailureDescription(other: any): string;

        /**
         * Returns the description of the failure
         *
         * The beginning of failure messages is "Failed asserting that" in most
         * cases. This method should return the second part of that sentence.
         *
         * To provide additional failure information additionalFailureDescription
         * can be used.
         *
         * @param other evaluated value or object
         */
        protected _failureDescription(other: any): string;
    }
}
