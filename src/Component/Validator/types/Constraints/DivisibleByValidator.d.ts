declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;

    /**
     * Validates that values are a multiple of the given number.
     */
    export class DivisibleByValidator extends AbstractComparisonValidator {
        /**
         * @inheritdoc
         */
        protected _compareValues(value1: any, value2: any): boolean;

        /**
         * @inheritdoc
         */
        protected _getErrorCode(): string;
    }
}
