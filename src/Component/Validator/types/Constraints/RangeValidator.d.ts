declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Range = Jymfony.Component.Validator.Constraints.Range;
    import PropertyAccessorInterface = Jymfony.Contracts.PropertyAccess.PropertyAccessorInterface;
    import PropertyPathInterface = Jymfony.Contracts.PropertyAccess.PropertyPathInterface;

    export class RangeValidator extends ConstraintValidator {
        private _propertyAccessor: PropertyAccessorInterface;

        /**
         * Constructor
         */
        __construct(propertyAccessor?: PropertyAccessorInterface): void;
        constructor(propertyAccessor?: PropertyAccessorInterface);

        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Range): void;

        /**
         * Gets the limit from specified by property path.
         */
        private _getLimit(propertyPath: string | PropertyPathInterface, $default: any, constraint: Range): any;

        /**
         * Gets an instance of property accessor.
         */
        private _getPropertyAccessor(): PropertyAccessorInterface;
    }
}
