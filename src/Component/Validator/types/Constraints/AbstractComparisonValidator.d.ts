declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import PropertyAccessorInterface = Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface;

    export abstract class AbstractComparisonValidator extends ConstraintValidator {
        private _propertyAccessor: PropertyAccessorInterface;

        /**
         * Constructor.
         */
        __construct(propertyAccessor?: PropertyAccessorInterface): void;
        constructor(propertyAccessor?: PropertyAccessorInterface);

        /**
         * @inheritdoc
         */
        validate(value: any, constraint: AbstractComparison): void;

        /**
         * Compares the two given values to find if their relationship is valid.
         *
         * @param value1 The first value to compare
         * @param value2 The second value to compare
         *
         * @returns true if the relationship is valid, false otherwise
         */
        protected abstract _compareValues(value1: any, value2: any): boolean;

        /**
         * Returns the error code used if the comparison fails.
         *
         * @returns The error code or `null` if no code should be set
         */
        protected _getErrorCode(): null | string;

        /**
         * Gets a property accessor instance.
         */
        private _getPropertyAccessor(): PropertyAccessorInterface;
    }
}
