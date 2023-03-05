declare namespace Jymfony.Component.Testing.Constraints {
    export class Count extends Constraint {
        private _expectedCount: number;

        /**
         * Constructor.
         */
        __construct(expected: number): void;
        constructor(expected: number);

        toString(): string;

        /**
         * Evaluates the constraint for parameter $other. Returns true if the
         * constraint is met, false otherwise.
         *
         * @throws {Exception}
         */
        matches(other: any): boolean;

        /**
         * Returns the description of the failure.
         *
         * The beginning of failure messages is "Failed asserting that" in most
         * cases. This method should return the second part of that sentence.
         *
         * @param {*} other evaluated value or object
         */
        protected _failureDescription(other: any): string;

        /**
         * @throws {Exception}
         */
        private _getCountOf(other: any): number | null;
    }
}
