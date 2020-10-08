declare namespace Jymfony.Component.Validator.Exception {
    import ConstraintViolationListInterface = Jymfony.Component.Validator.ConstraintViolationListInterface;
    import RuntimeException = Jymfony.Component.Validator.Exception.RuntimeException;

    export class ValidationFailedException extends RuntimeException {
        private _violations: ConstraintViolationListInterface;
        private _value: any;

        /**
         * Constructor.
         */
        // @ts-ignore
        __construct(value: any, violations: ConstraintViolationListInterface): void;
        constructor(value: any, violations: ConstraintViolationListInterface);

        /**
         * Gets the invalid value.
         */
        public readonly value: any;

        /**
         * Gets the violation list.
         */
        public readonly violations: ConstraintViolationListInterface;
    }
}
