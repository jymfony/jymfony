declare namespace Jymfony.Component.Validator.Constraints {
    import AbstractComparisonValidator = Jymfony.Component.Validator.Constraints.AbstractComparisonValidator;

    export class EqualToValidator extends AbstractComparisonValidator {
        /**
         * @inheritdoc
         */
        protected _compareValues(value1: any, value2: any): boolean;

        /**
         * @inheritdoc
         */
        protected _getErrorCode(): null | string;
    }
}
