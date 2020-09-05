declare namespace Jymfony.Component.Validator.Constraints {
    import ConstraintValidator = Jymfony.Component.Validator.ConstraintValidator;
    import Email = Jymfony.Component.Validator.Constraints.Email;

    /**
     * @memberOf Jymfony.Component.Validator.Constraints
     */
    export class EmailValidator extends ConstraintValidator {
        private _defaultMode: string;

        /**
         * Constructor.
         */
        __construct(defaultMode?: string): void;
        constructor(defaultMode?: string);

        /**
         * @inheritdoc
         */
        validate(value: any, constraint: Email): void;
    }
}
